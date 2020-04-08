'use strict';

const Service = require('egg').Service;
const api = require('../extend/api/api_helper');

class TradeService extends Service {
  async ownedTradesWithTp(tpHash, accountId, count = 10) {
    const trades = await api.getOwnedTradesWithTp(tpHash, accountId, count);

    return Promise.all(
      trades.map(async o => {
        const { datetime } = await this._blockOf(
          o.hash
        );

        return { ...o, datetime };
      })
    );
  }

  async tradesWithTp(tpHash, count = 20) {
    const trades = await api.getTradesWithTp(tpHash, count);

    return Promise.all(
      trades.map(async o => {
        const { datetime } = await this._blockOf(
          o.hash
        );

        return { ...o, datetime };
      })
    );
  }

  async getOwnedTrades(account, count = 20) {
    const trades = await api.getOwnedTrades(account, count);

    return Promise.all(
      trades.map(async o => {
        const { datetime } = await this._blockOf(
          o.hash
        );

        return { ...o, datetime };
      })
    );
  }

  async _blockOf(hash) {
    const { mysql } = this.app;
    const noPrefixHash = hash.replace('0x', '');
    const sql = `SELECT * FROM data_trade where trade_hash='${noPrefixHash}'`;

    const data = await mysql.query(sql);

    if (!data[0]) {
      return {};
    }

    const block = await mysql.get('data_block', { id: data[0].block_id });

    return { ...block };
  }
}

module.exports = TradeService;
