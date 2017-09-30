const gdaxWrapper = require('./modules/gdaxWrapper');
const gager = require('./modules/gager');
const config = require('./config.json');
const noise = require('./modules/noise');
const strings = require('./modules/strings')();

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

const precision = process.env.PRECISION || 2;

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

let latestTrades = false; 

async function displayLatestTrades() {

  latestTrades = await gdaxWrapper.getLatestTrades(publicClient[productID]);
 
  if(latestTrades) {

    if(latestTrades.bought.amt && latestTrades.sold.amt) {
      console.log('%s @ %s | %s @ %s', 
        latestTrades.bought.len.formatting(4, "green"),
        latestTrades.bought.amt.formatting(10, "green", precision), 
        latestTrades.sold.len.formatting(4, "red"),
        latestTrades.sold.amt.formatting(10, "red", precision)
      );
    }
    else if (latestTrades.bought.amt) {
       console.log('%s @ %s | ', 
        latestTrades.bought.len.formatting(4, "green"),
        latestTrades.bought.amt.formatting(10, "green", precision)
      );
    }
    else if (latestTrades.sold.amt) {
      console.log('%s | %s @ %s', 
        ''.padStart(17),
        latestTrades.sold.len.formatting(4, "red"),
        latestTrades.sold.amt.formatting(10, "red", precision)
      );
    }
   
    if(latestTrades.runningTotal >= 0) {
      console.log('%s', latestTrades.runningTotal.formatting(50, "green", precision)); 
    }
    else {
      console.log('%s', latestTrades.runningTotal.formatting(50, "red", precision));
    }

  }
}

setInterval( displayLatestTrades, interval);


