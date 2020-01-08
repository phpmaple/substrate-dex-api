'use strict';

const Controller = require('egg').Controller;

class TickerController extends Controller {
  async index() {
    const ticker = await this.ctx.service.ticker.getTicker(this.ctx.params.hash);

    this.ctx.body = ticker;
  }
}

module.exports = TickerController;
