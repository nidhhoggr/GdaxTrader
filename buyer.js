const gdaxWrapper = require('./modules/gdaxWrapper');
const gager = require('./modules/gager');
const config = require('./config.json');
const noise = require('./modules/noise');

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

const interval = config.defaults.bottomFinderInterval;

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

async function findBottom(client) {
  const ticker = await gdaxWrapper.getTicker(client);
  const productID = client.productID;
  ticker.price = parseFloat(ticker.price);
  const tickerPrice = ticker.price;
  debug(client, `Highest point is ${highestPoint[productID]} from ${tickerPrice}`);
  if(!highestPoint[productID] || tickerPrice > highestPoint[productID]) {
    highestPoint[productID] = tickerPrice;
  }
  if((highestPoint[productID] - tickerPrice) >= mustMeet) {
    noise.soundAlarm();
  }
}

const mine = publicClient[productID];
const theirs = publicClient[theirID];

findBottom(mine);

let mineGager, theirGager = false;

setInterval( () => {

  findBottom(mine);

  mineGager = gager.gageByClient(mine);
  if(mineGager) {
    gager.printByClient(mine);
  }

  theirGager = gager.gageByClient(theirs);
  if(theirGager) {
    gager.printByClient(theirs);
  }

}, interval);
