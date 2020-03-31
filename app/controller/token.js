'use strict';

const Controller = require('egg').Controller;

const createRule = {
  id: 'string',
  name: 'string',
  precision: 'int',
  supply: 'string',
};

class TokenController extends Controller {
  async index() {
    const result = await this.ctx.service.token.find();
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

    const result = await ctx.service.token.create(ctx.request.body);

    this.ctx.body = result;
  }
}

module.exports = TokenController;
