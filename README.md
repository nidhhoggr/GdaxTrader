# GdaxBuyer

I wrote this to monitor trend and looks for peaks and bottom to get in and out of the market at 
the right time.

### Examples

To run the seller or the min peak finder:

```bash
LAST_PURCHASE_AMT=5267.02 LAST_PURCHASE_PRICE=295.68 MIN_PROFIT_PEAK=1 node seller.js
```

To test a break even point.

```bash
LAST_PURCHASE_AMT=5267.02 LAST_PURCHASE_PRICE=295.68 MIN_PROFIT_PEAK=1 TLP=300 node seller.js
```

To run the buyer of the bottom finder:

```bash
MM=1 node buyer.js
```


### Soon To Come

* Provide ability to trigger sales or purchases using the gdax auth API when the alarm sounds
