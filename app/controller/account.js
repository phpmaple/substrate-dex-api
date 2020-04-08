'use strict';

const Controller = require('egg').Controller;

class AccountController extends Controller {
  async balance() {
    const tokenHash = this.ctx.queries.tokenHash ? this.ctx.queries.tokenHash.shift() : null;
    const balance = await this.ctx.service.account.getBalance(this.ctx.params.accountId, tokenHash);

    this.ctx.body = balance;
  }
  async systemBalance() {
    const balance = await this.ctx.service.account.getSystemBalance(this.ctx.params.accountId);

    this.ctx.body = balance;
  }
}

module.exports = AccountController;
