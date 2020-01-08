'use strict';
const { WsProvider, ApiPromise } = require('@polkadot/api');
const _ = require('lodash');

const types = require('../../../config/runtimeTypes');

let api;


module.exports = {
  async init(url) {
    const provider = new WsProvider(url);
    api = await ApiPromise.create({ provider, types: types.types });
  },

  async getFreeBalance(accountId, hash) {
    const result = await api.query.tokenModule.freeBalanceOf([ accountId, hash ]);

    return result.toNumber();
  },

  async getFreezedBalance(accountId, hash) {
    const result = await api.query.tokenModule.freezedBalanceOf([ accountId, hash ]);

    return result.toNumber();
  },

  // TradePair
  async getTradePair(hash) {
    const result = await api.query.tradeModule.tradePairs(hash);

    return result.isSome ? result.unwrap().toJSON() : {};
  },

  //      Order
  async getOwnedOrders(accountId) {
    const maxIndex = await api.query.tradeModule.ownedOrdersIndex(accountId);
    const multiParams = _.range(maxIndex).map(i => [ accountId, i ]);

    const coupleOfHash = await api.query.tradeModule.ownedOrders.multi(multiParams);

    return await this.ordersWith(coupleOfHash.map(v => v.toHex()));
  },

  async getOwnedTpOpenedOrders(accountId, hash) {
    const coupleOfHash = await api.query.tradeModule.ownedTPOpenedOrders([ accountId, hash ]);

    return await this.ordersWith(coupleOfHash.toJSON());
  },

  async getOwnedTpClosedOrders(accountId, hash) {
    const coupleOfHash = await api.query.tradeModule.ownedTPClosedOrders([ accountId, hash ]);

    return await this.ordersWith(coupleOfHash.toJSON());
  },

  async getOrderBookWithTp(hash, price = null, maxNum = 10) {
    const linkItem = await api.query.tradeModule.linkedItemList([ hash, price ]);

    const item = linkItem.toJSON();
    if (maxNum === 1) {
      return item;
    }
    let prev = item.prev;
    let next = item.next;
    const buyOrders = [];
    const sellOrders = [];

    for (const i in _.range(maxNum)) { // eslint-disable-line no-unused-vars
      if (prev === 0) {
        prev = null;
      }
      if (next === '0xffffffffffffffffffffffffffffffff') {
        next = null;
      }

      if (prev) {
        const item = await this.getOrderBookWithTp(hash, prev, 1);
        prev = item.prev;
        const { orders, ...rest } = item;// eslint-disable-line no-unused-vars
        buyOrders.push(rest);
      }

      if (next) {
        const item = await this.getOrderBookWithTp(hash, next, 1);
        next = item.next;
        const { orders, ...rest } = item;// eslint-disable-line no-unused-vars

        sellOrders.unshift(rest);
      }

    }
    return [ sellOrders, buyOrders ];
  },

  async ordersWith(hash) {
    const result = await api.query.tradeModule.orders.multi(hash);
    return result.map(o => o.toJSON());
  },

  async tradesWith(hash) {
    const result = await api.query.tradeModule.trades.multi(hash);
    return result.map(o => o.toJSON());
  },
  //      Trade
  async getOwnedTradesWithTp(hash, accountId, maxNum = 20) {
    const maxIndex = await api.query.tradeModule.ownedTPTradesIndex([ accountId, hash ]);

    const multiParams = _.range(maxIndex - 1, Math.max(0, maxIndex - maxNum), -1).map(i => [ accountId, hash, i ]);
    const coupleOfHash = await api.query.tradeModule.ownedTPTrades.multi(multiParams);
    return await this.tradesWith(coupleOfHash.map(v => v.toHex()));
  },

  async getTradesWithTp(hash, maxNum = 20) {
    const maxIndex = await api.query.tradeModule.tradePairOwnedTradesIndex(hash);

    const multiParams = _.range(maxIndex - 1, Math.max(0, maxIndex - maxNum), -1).map(i => {
      return [ hash, i ];
    });
    const coupleOfHash = await api.query.tradeModule.tradePairOwnedTrades.multi(multiParams);
    return await this.tradesWith(coupleOfHash.map(v => v.toHex()));
  },
};
