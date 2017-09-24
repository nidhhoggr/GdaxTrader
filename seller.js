const gdaxWrapper = require('./modules/gdaxWrapper');
const config = require('./config.json');
const noise = require('./modules/noise');

const authClient = new gdaxWrapper.getAuthClient(
  config.gdax.key,
  config.gdax.secret,
  config.gdax.passphrase,
  "https://api.gdax.com"
);

const productID = process.env.PRODUCT_ID || config.defaults.productId;

const publicClient = gdaxWrapper.getPublicClient(productID);

const interval = config.defaults.peakFinderInterval;

let totalSharesMem, initialStandingMem = false;
const tradingFee = parseFloat(config.gdax.tradingFee);
const lastPurchaseAmount = parseFloat(process.env.LAST_PURCHASE_AMT);
const lastPurchasePrice = parseFloat(process.env.LAST_PURCHASE_PRICE);
const minProfitAllowed = parseFloat(process.env.MIN_PROFIT_PEAK);
const initialStanding = (lastPurchaseAmount - lastPurchaseAmount * tradingFee);
const totalShares = initialStanding / lastPurchasePrice;
console.log(`Your initial standing is: ${initialStanding}`);
console.log(`Your total shares are: ${totalShares}`);

function shouldDoSale(lastPrice) {
  let currentStanding = (lastPrice * totalShares) - (lastPurchaseAmount * tradingFee);
  console.log(`Last Price: ${lastPrice}  - Total Shares: ${totalShares}`);
  console.log(`Your current standing is ${currentStanding}`);
  currentStanding -= currentStanding * tradingFee;
  console.log(`    minus the trading fee: ${currentStanding}`);
  currentStanding = currentStanding - initialStanding;
  console.log(`Profit to be made if sold: ${currentStanding}`);
  console.log(`----------------------------------------------------------`);
  return (currentStanding >= minProfitAllowed);
}

function updateStats() {
  publicClient.getProductTicker( (err, response, body) => {
    if(err) {
      console.error(err); 
    }
    else if(body) {
      noise.sayTicker(body);
      if(shouldDoSale(parseFloat(body.price))) {
        noise.soundAlarm();
      }
    }
  });
}

if(process.env.TLP) {
  shouldDoSale(parseFloat(process.env.TLP));
}
else {

  updateStats();

  setInterval( () => {

    updateStats();

  }, interval);
}
