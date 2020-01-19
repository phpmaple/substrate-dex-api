'use strict';

const Service = require('egg').Service;
const api = require('../extend/api/api_helper');

class TradeService extends Service {
  async ownedTradesWithTp(tpHash, accountId, count = 10) {
    const trades = await api.getOwnedTradesWithTp(tpHash, accountId, count);

    return Promise.all(
      trades.map(async o => {
        const { datetime } = await this._blockOfEvent(
          o.hash,
          this.app.config.events.trade[2]
        );

        return { ...o, datetime };
      })
    );
  }

  async tradesWithTp(tpHash, count = 20) {
    const trades = await api.getTradesWithTp(tpHash, count);

    return Promise.all(
      trades.map(async o => {
        const { datetime } = await this._blockOfEvent(
          o.hash,
          this.app.config.events.trade[2]
        );

        return { ...o, datetime };
      })
    );
  }

  async _blockOfEvent(hash, event) {
    const { mysql } = this.app;
    const Literal = mysql.literals.Literal;
    const contain = Literal(
      `JSON_CONTAINS(attributes, '{"value": "${hash}"}')`
    );
    const sql = `SELECT * FROM data_event where event_id='${event}' and ${contain}`;

    const data_event = await mysql.query(sql);

    if (!data_event[0]) {
      return {};
    }

    const block = await mysql.get('data_block', { id: data_event[0].block_id });

    return { ...block };
  }
}

module.exports = TradeService;
