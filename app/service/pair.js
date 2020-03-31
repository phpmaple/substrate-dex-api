'use strict';

const Service = require('egg').Service;

class PairService extends Service {
  async create(pair) {
    return await this.ctx.model.Pair.update({ id: pair.id }, pair, {
      upsert: true,
    });
  }

  async find() {
    return await this.ctx.model.Pair.find(null, { _id: 0, __v: 0 });
  }
}
module.exports = PairService;
