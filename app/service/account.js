'use strict';

const Service = require('egg').Service;
const api = require('../extend/api/api_helper');

class AccountService extends Service {
  async getBalance(accountId, hash) {

    if (hash) {
      const freeBalance = await api.getFreeBalance(accountId, hash);
      const freezedBalance = await api.getFreezedBalance(accountId, hash);
      const systemBalance = await api.getSystemBalance(accountId);

      return { freeBalance, freezedBalance, systemBalance };
    }
    const tokens = await this.ctx.service.token.find();
    const all = await api.getAllBalance(accountId, tokens);
    return all;

  }

  async getSystemBalance(accountId) {
    const systemBalance = await api.getSystemBalance(accountId);
    return { systemBalance };
  }
}

module.exports = AccountService;
