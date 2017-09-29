const gdaxWrapper = require('./modules/gdaxWrapper');
const gager = require('./modules/gager');
const config = require('./config.json');
const noise = require('./modules/noise');

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

const authClient = new gdaxWrapper.getAuthClient(
  config.gdax.key, 
  config.gdax.secret, 
  config.gdax.passphrase, 
  "https://api.gdax.com"
);

const publicClient = {
  "ETH-USD": gdaxWrapper.getPublicClient('ETH-USD'),
  "BTC-USD": gdaxWrapper.getPublicClient('BTC-USD')
};

const productID = process.env.PRODUCT_ID || config.defaults.productId;
//biased af
const theirID = (productID == "ETH-USD") ? "BTC-USD" : "ETH-USD";

const interval = 5000;

const mustMeet = parseFloat(process.env.MM || config.defaults.bottomFinderThreshold);

const highestPoint = {
 'ETH-USD': false,
 'BTC-USD': false
};

function debug(client, msg) {
  if(client.productID == productID) {
    console.log(msg);
  }
}

let last = false;
let runningTotal = 0, lastTradeId = 0, bought, sold;

setInterval( () => {
  publicClient[productID].getProductTrades((err, response, res) => {
    res = res.filter((r) => (r.trade_id > lastTradeId));
    if(res.length) {
      bought = res.filter((r) =>r.side == "sell");
      sold = res.filter((r) =>r.side == "buy");
      
      const toReturn = {
        bought: {
          len: bought.length,
        },
        sold: {
          len: sold.length,
        }
      };

      toReturn.bought.amt = (bought.length) ? bought.reduce( (p, n) => ({size: parseFloat(p.size) + parseFloat(n.size)})).size : 0;
      toReturn.sold.amt = (sold.length) ? sold.reduce( (p, n) => ({size: parseFloat(p.size) + parseFloat(n.size)})).size : 0;
      runningTotal += toReturn.bought.amt - toReturn.sold.amt;
      
      if(toReturn.bought.amt && toReturn.sold.amt) {
        console.log('\x1b[32m%s\x1b[0m @ \x1b[32m%s\x1b[0m | \x1b[31m%s\x1b[0m @ \x1b[31m%s\x1b[0m', 
          bought.length.toString().padStart(4), 
          toReturn.bought.amt.toFixed(2).toString().padStart(10), 
          sold.length.toString().padStart(4), 
          toReturn.sold.amt.toFixed(2).toString().padStart(10)
        );
      }
      else if (toReturn.bought.amt) {
         console.log('\x1b[32m%s\x1b[0m @ \x1b[32m%s\x1b[0m | ', 
          bought.length.toString().padStart(4),
          parseFloat(toReturn.bought.amt).toFixed(2).toString().padStart(10)
        );
      }
      else if (toReturn.sold.amt) {
        console.log('%s | \x1b[31m%s\x1b[0m @ \x1b[31m%s\x1b[0m', 
          ''.padStart(17),
          sold.length.toString().padStart(4), 
          parseFloat(toReturn.sold.amt).toFixed(2).toString().padStart(10)
        );
      }
     
      if(runningTotal >= 0) {
        console.log('\x1b[32m%s\x1b[0m', runningTotal.toFixed(2).toString().padStart(50)); 
      }
      else {
        console.log('\x1b[31m%s\x1b[0m', runningTotal.toFixed(2).toString().padStart(50));
      }

      lastTradeId = res[0].trade_id;
    }
  });
}, interval);


