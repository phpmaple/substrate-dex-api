'use strict';

const Service = require('egg').Service;
const api = require('../extend/api/api_helper');

class OrderService extends Service {
  async ownedOrders(accountId) {
    const orders = await api.getOwnedOrders(accountId);

    return Promise.all(
      orders.map(async o => {
        const { datetime } = await this._blockOf(
          o.hash
        );

        return { ...o, datetime };
      })
    );
  }

  async ownedOrdersWith(accountId, tpHash, isOpened) {
    const orders = isOpened
      ? await api.getOwnedTpOpenedOrders(accountId, tpHash)
      : await api.getOwnedTpClosedOrders(accountId, tpHash);

    return Promise.all(
      orders.map(async o => {

        const { datetime } = await this._blockOf(
          o.hash
        );

        return { ...o, datetime };
      })
    );
  }

  async orderBook(hash, count = 10) {
    const orderBook = await api.getOrderBookWithTp(hash, null, count);

    return orderBook;
  }

  async _blockOf(hash) {
    const { mysql } = this.app;
    const noPrefixHash = hash.replace('0x', '');
    const sql = `SELECT * FROM data_order where order_hash='${noPrefixHash}'`;

    const data = await mysql.query(sql);

    if (!data[0]) {
      return {};
    }

    const block = await mysql.get('data_block', { id: data[0].block_id });

    return { ...block };
  }

}

module.exports = OrderService;
