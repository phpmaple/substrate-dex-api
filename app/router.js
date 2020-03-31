'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  app.router.get('/', app.controller.home.index);
  app.router.get('/api/v1/account/:accountId', app.controller.account.balance);

  app.router.resources('orders', '/api/v1/orders', app.controller.order);
  app.router.get('/api/v1/orderbook/:hash', app.controller.order.orderbook);

  app.router.resources('trades', '/api/v1/trades', app.controller.trade);

  app.router.get('/api/v1/ticker/:hash', app.controller.ticker.index);

  app.router.resources('token', '/api/v1/token', app.controller.token);
  app.router.resources('pair', '/api/v1/pair', app.controller.pair);

};
