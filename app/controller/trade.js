'use strict';

const Controller = require('egg').Controller;

class TradeController extends Controller {
  async index() {
    const { accountId, hash } = this.ctx.queries;
    const account = accountId && accountId.shift();
    const tpHash = hash && hash.shift();

    let trades;
    try {
      if (account && tpHash) {
        trades = await this.ctx.service.trade.ownedTradesWithTp(tpHash, account);
      } else if (tpHash) {
        trades = await this.ctx.service.trade.tradesWithTp(tpHash);
      } else if (account) {
        trades = {};// TODO:
      }
    } catch (error) {
      trades = {};
    }


    this.ctx.body = trades;
  }
}

module.exports = TradeController;
