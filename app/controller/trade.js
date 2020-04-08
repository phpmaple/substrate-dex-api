'use strict';

const Controller = require('egg').Controller;

class TradeController extends Controller {
  async index() {
    const { accountId, hash } = this.ctx.queries;
    const account = accountId && accountId.shift();
    const tpHash = hash && hash.shift();
    const count = this.ctx.queries.count ? this.ctx.queries.count.shift() : 20;

    let trades;
    try {
      if (account && tpHash) {
        trades = await this.ctx.service.trade.ownedTradesWithTp(tpHash, account, count);
      } else if (tpHash) {
        trades = await this.ctx.service.trade.tradesWithTp(tpHash, count);

      } else if (account) {
        trades = await this.ctx.service.trade.getOwnedTrades(account, count);
      }
    } catch (error) {
      console.error(error);
      trades = {};
    }


    this.ctx.body = trades;
  }
}

module.exports = TradeController;
