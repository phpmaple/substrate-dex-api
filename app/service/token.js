'use strict';

const Service = require('egg').Service;

class TokenService extends Service {
  async findBlock(id) {
    const { mysql } = this.app;
    const Literal = mysql.literals.Literal;
    const contain = Literal(`JSON_CONTAINS(attributes, '{"value": "${id}"}')`);
    const sql = `SELECT * FROM data_event where event_id='OrderCreated' and ${contain}`;
    const block = await mysql.query(sql);
    return { block };
  }
}

module.exports = TokenService;
