const Gdax = require('gdax');

module.exports = {
  getAuthClient,
  getPublicClient,
  getTicker,
  getLatestTrades,
  resetLatestTradesRunningTotal
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

const _latestTrades = {
  runningTotal: 0,
  lastTradeId: 0
};

function resetLatestTradesRunningTotal() {
  _latestTrades.runningTotal = 0;
}

function getLatestTrades(pc) {
  let bought, sold;
  return new Promise((resolve,reject) => {
    pc.getProductTrades((err, response, trades) => {
      res = trades.filter((r) => (r.trade_id > _latestTrades.lastTradeId));
      if(trades.length) {
        bought = trades.filter((r) =>r.side == "sell");
        sold = trades.filter((r) =>r.side == "buy");
        
        const toReturn = {
          bought: {
            len: bought.length,
          },
          sold: {
            len: sold.length,
          }
        };

        boughtAmt = (bought.length) ? bought.reduce( (p, n) => ({size: parseFloat(p.size) + parseFloat(n.size)})).size : 0;
        soldAmt = (sold.length) ? sold.reduce( (p, n) => ({size: parseFloat(p.size) + parseFloat(n.size)})).size : 0;
        _latestTrades.runningTotal += boughtAmt - soldAmt;

        resolve({
          bought: {
            len: bought.length,
            amt: boughtAmt
          },
          sold: {
            len: sold.length,
            amt: soldAmt
          },
          runningTotal: _latestTrades.runningTotal
        });

        _latestTrades.lastTradeId = trades[0].trade_id;
      }
      else {
        resolve(false);
      }
    });
  });
}
