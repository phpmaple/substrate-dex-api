'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async index() {
    const { accountId, isOpened, hash } = this.ctx.queries;
    const account = accountId && accountId.shift();
    const opened = isOpened && isOpened.shift();
    const tpHash = hash && hash.shift();

    let orders;
    if (opened && tpHash) {
      orders = await this.ctx.service.order.ownedOrdersWith(account, tpHash, opened === '1');
    } else {
      orders = await this.ctx.service.order.ownedOrders(account);
    }

    this.ctx.body = orders;
  }

  async orderbook() {
    const count = this.ctx.queries.count ? this.ctx.queries.count.shift() : 10;
    this.ctx.body = await this.ctx.service.order.orderBook(this.ctx.params.hash, count);
  }
}

module.exports = OrderController;
