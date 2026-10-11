---
"@krizaka/charts": minor
---

Ready-made charts, named for the screens of the Krizaka apps, web and React Native: `EarningsChart` (`./earnings`:
earnings per period in money minor units, the total, the last period's change, the payout threshold), `JobThroughput`
(`./throughput`: jobs per period stacked by status, the total and the success rate), `LatencyChart` (`./latency`: p50
and p95 per item in the unit that fits, against an objective; `formatDuration`), `CreditUsage` (`./credits`: what is
left of an allowance, a meter in tones, the use per day, the run-out date), `GoalProgress` (`./goal`: a pot towards its
goal, its supporters and the time left) and `PriceTicker` (`./ticker`: a live auction's price, the change since the
opening, the bids as steps, the reserve). Each one leads with its key figure in words; `@krizaka/charts/native` has
them all. Every chart's documentation now carries a `tier` — `ready-made`, `core` or `advanced` (radar, heatmap,
calendar, sankey, funnel, candlestick, treemap, scatter, `Chart`, the map and the globe: no product screen uses them
today). Fix: a `live` line chart no longer hides its line and dots while the entrance is suppressed.
