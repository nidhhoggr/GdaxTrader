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

const ethPublicClient = gdaxWrapper.getPublicClient('ETH-USD');
const btcPublicClient = gdaxWrapper.getPublicClient('BTC-USD');

const interval = config.defaults.bottomFinderInterval;

const mustMeet = parseFloat(process.env.MM || config.defaults.bottomFinderThreshold);

const highestPoint = {
 'ETH-USD': false,
 'BTC-USD': false
};

function debug(client, msg) {
  if(client.productID == "ETH-USD") {
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

let btcGager, ethGager = false;

findBottom(ethPublicClient);

setInterval( () => {

  findBottom(ethPublicClient);

  ethGager = gager.gageByClient(ethPublicClient);
  if(ethGager) {
    gager.printByClient(ethPublicClient);
  }

  btcGager = gager.gageByClient(btcPublicClient);
  if(btcGager) {
    gager.printByClient(btcPublicClient);
  }

}, interval);
