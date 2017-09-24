const gdaxWrapper = require('./gdaxWrapper');

module.exports = {
  gageByClient,
  printByClient
};

const gage = {
  "timeout": 1000,
  "ETH-USD": {
    "can": true,
    "trend": 0
  },
  "BTC-USD": {
    "can": true,
    "trend": 0
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

    productGage.trend += trend;
    gage[productID] = {
      can: false,
      last: ticker.price,
      trend: productGage.trend,
      sign: (trend > 0) ? "bull" : (trend < 0) ? "bear" : "sleep"
    }
    setTimeout( () => {gage[productID].can = true}, gage.timeout);
    return gage[productID];
  } 
}

function printByClient(client) {
  const clientGage = gage[client.productID];
  if(clientGage.sign == "bull") {
    console.log('\x1b[32m%s: %f | %f \x1b[0m', client.productID, clientGage.last, clientGage.trend.toFixed(2));
  }
  else if(clientGage.sign == "bear") {
    console.log('\x1b[31m%s: %f | %f \x1b[0m', client.productID, clientGage.last, clientGage.trend.toFixed(2));
  }
  else {
    console.log('\x1b[36m%s: %f | %f \x1b[0m', client.productID, clientGage.last, clientGage.trend.toFixed(2));
  }
}
