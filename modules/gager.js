const gdaxWrapper = require('./gdaxWrapper');
const strings = require('./strings')();

module.exports = {
  gageByClient,
  printByClient
};

const gage = {
  "timeout": 1000,
  "ETH-USD": {
    "can": true,
    "trend": 0,
    "last": 0
  },
  "BTC-USD": {
    "can": true,
    "trend": 0,
    "last": 0
  },
  "LTC-USD": {
    "can": true,
    "trend": 0,
    "last": 0
  },
  "ZRX-USD": {
    "can": true,
    "trend": 0,
    "last": 0
  }
};

async function gageByClient(client, ticker) {

  const productID = client.productID;
  const productGage = gage[productID];

  if(productGage.can) {
    if(!ticker) {
      ticker = await gdaxWrapper.getTicker(client);
    }
  
    if(!productGage.last) productGage.last = ticker.price;

    let trend = ticker.price - productGage.last;

    if(!isNaN(trend)) {
      productGage.trend += trend;
    }
    gage[productID] = {
      can: false,
      last: parseFloat(ticker.price) || 0,
      trend: productGage.trend,
      sign: (trend > 0) ? "bull" : (trend < 0) ? "bear" : "sleep"
    }
    setTimeout( () => {gage[productID].can = true}, gage.timeout);
    return gage[productID];
  } 
}

function printByClient(client) {
  const clientGage = gage[client.productID];
  const color = (clientGage.sign == "bull") ? "green" : (clientGage.sign == "bear") ? "red" : "cyan";
  console.log('%s | %s | %s', 
    client.productID.wrapInColor(color),
    clientGage.last.formatting(10, color, 2),
    clientGage.trend.formatting(10, color, 2)
  );
}
