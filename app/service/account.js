'use strict';

const Service = require('egg').Service;
const api = require('../extend/api/api_helper');

class AccountService extends Service {
  async getBalance(accountId, hash) {
    const freeBalance = await api.getFreeBalance(accountId, hash);
    const freezedBalance = await api.getFreezedBalance(accountId, hash);

    return { freeBalance, freezedBalance };
  }
}

module.exports = AccountService;
