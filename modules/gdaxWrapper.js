const Gdax = require('gdax');

module.exports = {
  getAuthClient,
  getPublicClient,
  getTicker
};

function getAuthClient() {
  return Gdax.AuthenticatedClient;  
}

function getPublicClient(productID) {
  return new Gdax.PublicClient(productID);
}

function getTicker(pc) {
  return new Promise((resolve,reject) => {
    pc.getProductTicker( (err, response, body) => {
      if(err) {
        console.error(err);
        reject(err);
      }
      else {
        resolve(body);
      }
    });
  }); 
};
