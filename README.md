# GdaxBuyer

I wrote this to monitor trends and look for peaks and bottoms to get in and out of the market at 
the right time.

### Examples

* To run the seller (min peak finder):

```bash
LAST_PURCHASE_AMT=5267.02 LAST_PURCHASE_PRICE=295.68 MIN_PROFIT_PEAK=10 node seller.js
```

> LAST_PURCHASE_AMT

  The purcahse amount of your last order

> LAST_PURCHASE_PRICE

  The price of the cryptocurrency at the time of the purchase

> MIN_PROFIT_PEAK

  The amount the currency should increase by in order to trigger the alarm/sale.


---

* To test a break even point:

```bash
LAST_PURCHASE_AMT=5267.02 LAST_PURCHASE_PRICE=295.68 MIN_PROFIT_PEAK=10 TLP=300 node seller.js
```

> TLP

  Emulate the seller on a would-be ticker price see profit/loss


---

* To run the buyer (bottom finder):

```bash
PRODUCT_ID=BTC-USD MM=1 node buyer.js
```
> MM

  The Min Bottom: Whatever value is provided here will sound an alarm when the bottom is reached.

> PRODUCT_ID

  The GDAX token for the product id. you can omit this paramter and default to `$.defaults.productId` in your configuration.

### Configuration

```json
{
  "defaults": {
    "productId": "ETH-USD",
    "bottomFinderThreshold": 10,
    "bottomFinderInterval": 5000,
    "peakFinderInterval": 5000,
    "sayInterval": 0,
    "alarmInterval": 60000
  },
  "gdax": {
    "tradingFee": ".003",
    "key": "YOUR_GDAX_KEY",
    "secret": "YOUR_GDAX_SECRET",
    "passphrase": "YOUR_GDAX_PASSPHRASE"
  }
}
```

> $.defaults.productId

Default GDAX product token to specify. e.g. `ETH-USD`,`BTC-USD`,`LTC-USD`

> $.defaults.bottomFinderThreshold

Used in place of `process.env.MM` on buyer.js, the min bottom.

> $.defaults.bottomFinderInterval

Number in microseconds of timelapse to search for the bottom in buyer.js

>$.defaults.peakFinderInterval

Number in microseconds of timelapse to search for the min peak in seller.js

>$.defaults.sayInterval

Number in microseconds of timelapse to allow the speech module to announce the ticker price

>$.defaults.alarmInterval

Number in microseconds of timelapse to allow the alarm to sound

### Soon To Come

* Provide ability to trigger sales or purchases using the gdax auth API when the alarm sounds
