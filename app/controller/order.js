'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async index() {
    const orders = await this.ctx.service.trade.ownedOrders(this.ctx.queries.accountId.shift());

    this.ctx.body = orders;
  }

  async orderbook() {
    console.log(typeof this.ctx.params.hash);

    this.ctx.body = await this.ctx.service.trade.orderBook(this.ctx.params.hash);
  }
}

module.exports = OrderController;
