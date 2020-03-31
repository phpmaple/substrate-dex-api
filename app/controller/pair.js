'use strict';

const Controller = require('egg').Controller;

const createRule = {
  id: 'string',
  base: {
    type: 'object',
    rule: {
      id: 'string',
      name: 'string',
      precision: 'int',
    },
  },
  quote: {
    type: 'object',
    rule: {
      id: 'string',
      name: 'string',
      precision: 'int',
    },
  },
  info: {
    type: 'object',
    rule: {
      last_price: 'int',
      change: 'int',
      volume: 'int',
    },
  },
  book: {
    type: 'object',
    rule: {
      last_price: 'int',
      amount: 'int',
      total: 'int',
    },
  },
  choose: {
    type: 'object',
    rule: {
      last_price: 'int',
      volume: 'int',
    },
  },
  form: {
    type: 'object',
    rule: {
      min_trade_amount: 'number',
      amount_step: 'number',
      price_step: 'number',
      min_order_value: 'number',
      total_step: 'number',
    },
  },
};

class PairController extends Controller {
  async index() {
    const result = await this.ctx.service.pair.find();
    this.ctx.body = result;
  }

  async create() {
    const ctx = this.ctx;
    const secret = ctx.get('ADMIN_SECRET');

    if (secret !== this.app.config.adminserect) {
      this.ctx.body = '403 Forbidden';
      this.ctx.status = 403;
      return;
    }
    ctx.validate(createRule, ctx.request.body);

    const result = await ctx.service.pair.create(ctx.request.body);

    this.ctx.body = result;
  }
}

module.exports = PairController;
