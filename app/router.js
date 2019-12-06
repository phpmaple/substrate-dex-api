'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  app.router.get('/', app.controller.home.index);

  app.router.resources('orders', '/api/v1/orders', app.controller.order);
  app.router.get('/api/v1/orderbook/:hash', app.controller.order.orderbook);

  app.router.resources('trades', '/api/v1/trades', app.controller.trade);
};
