'use strict';

const Service = require('egg').Service;
const api = require('../extend/api/api_helper');

class TickerService extends Service {
  async getTicker(hash) {
    const ticker = await api.getTradePair(hash);

    return ticker;
  }
}

module.exports = TickerService;
