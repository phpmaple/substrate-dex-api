'use strict';

const Controller = require('egg').Controller;

class MarketController extends Controller {
  async history() {
    const before = this.ctx.queries.before.shift(); // will ceil to match period
    const period = this.ctx.queries.period.shift(); // seconds
    const limit = this.ctx.queries.limit.shift(); // max 500
    this.ctx.body = await this.ctx.service.market.history(
      before,
      period,
      Math.min(limit, 200)
    );
  }
}

module.exports = MarketController;
