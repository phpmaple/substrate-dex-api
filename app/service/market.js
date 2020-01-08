'use strict';

const Service = require('egg').Service;
const api = require('../extend/api/api_helper');
const _ = require('lodash');

class MarketService extends Service {
  async history(beforeTime, period, limit) {
    const floorWithPeriod = (time, interval) => {
      return ((new Date(time).getTime() / 1000) - (new Date(time).getTime() / 1000) % (interval)) * 1000;
    };

    const { mysql } = this.app;
    const endTime = floorWithPeriod(beforeTime, period);

    const end = new Date(endTime + period * 1000).toISOString();
    const startTime = endTime - period * (limit - 1) * 1000;
    const start = new Date(startTime).toISOString();
    console.log(' ', beforeTime, period, limit);

    const blocks = await mysql.query(
      `select id, datetime from data_block where datetime < '${end}' and datetime >= '${start}' and id >= 1`
    );
    console.log(`select id, datetime from data_block where datetime < '${end}' and datetime >= '${start}' and id >= 1 order by datetime asc`);

    if (blocks.length === 0) {
      return [];
    }

    // [block_id : block_datetime]
    const timeToBid = blocks.reduce((prev, cur) => {
      const formatTime = cur.datetime.replace(/ /g, 'T').concat('.000Z');
      // console.log(formatTime);

      const t = floorWithPeriod(formatTime, period);
      // console.log(t);

      if (!prev[t]) {
        prev[t] = [ cur.id ];
      } else {
        prev[t].push(cur.id);
      }
      return prev;
    }, {});
    // console.log(timeToBid);

    const first = blocks[0].id;
    const last = blocks[blocks.length - 1].id;

    const event = this.app.config.events.trade[2];
    const hash = await mysql.query(
      `select attributes->"$[3].value" as hash, block_id from data_event where event_id='${event}' and block_id >= ${first} and block_id <= ${last}`
    );

    // [block_id: [trade_hash]]
    const bidOwnedTrades = hash.reduce((prev, cur) => {
      const oldHash = prev[cur.block_id] || [];
      const h = cur.hash.replace(/"/g, '');
      return {
        ...prev,
        [cur.block_id]: [ h, ...oldHash ],
      };
    }, {});

    const trades = await api.tradesWith(
      hash.map(v => v.hash.replace(/"/g, ''))
    );

    // [trade_hash: trade]
    const tradeHashToTrade = trades.reduce((prev, cur) => {
      return { [cur.hash]: cur, ...prev };
    }, {});

    // bidToTrades : [block_id : [trades]]
    const bidToTrades = Object.keys(bidOwnedTrades).reduce((prev, cur) => {
      return { [cur]: bidOwnedTrades[cur].map(v => tradeHashToTrade[v]), ...prev };
    }, {});

    const data = [];
    let open;
    let high;
    let low;
    let close;
    let base_amount;
    let volume;

    // trades between block_from -> block_to
    const findTradesBetween = (from, to) => {
      // console.log(from, to);

      let trades = [];
      for (const i of _.range(from, to + 1)) {
        // console.log('>>', i);

        if (bidToTrades[i]) {
          trades = trades.concat(bidToTrades[i]);
        }
      }
      return trades;
    };

    // trades -> { max, min, baseAmount, quoteAmount }
    const tradeStat = trades => {
      let max = 0;
      let min = 0;
      let baseAmount = 0;
      let quoteAmount = 0;

      for (const trade of trades) {
        max = Math.max(trade.price, max);
        min = Math.max(trade.price, min);
        quoteAmount += trade.quote_amount;
        baseAmount += trade.base_amount;
      }
      return { max, min, baseAmount, quoteAmount };
    };

    for (const key in timeToBid) {
      const value = timeToBid[key];

      const trades = findTradesBetween(value[0], value[value.length - 1]);

      if (trades.length === 0) {
        continue;
      }
      open = trades[0].price;
      close = trades[trades.length - 1].price;
      const stat = tradeStat(trades);
      high = stat.max;
      low = stat.min;
      base_amount = stat.baseAmount;
      volume = stat.quoteAmount;

      const time = parseInt(key);
      data.push({ open, high, low, close, base_amount, volume, time });
    }

    return data;
  }
}

module.exports = MarketService;
