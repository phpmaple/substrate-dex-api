'use strict';

const Service = require('egg').Service;

class TokenService extends Service {
  async create(token) {
    return await this.ctx.model.Token.update({ id: token.id }, token, {
      upsert: true,
    });
  }

  async find() {
    return await this.ctx.model.Token.find(null, { _id: 0, __v: 0 });
  }
}

module.exports = TokenService;
