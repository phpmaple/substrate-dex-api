/* eslint valid-jsdoc: "off" */

'use strict';
require('dotenv').config();

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1575346880143_2716';

  // add your middleware config here
  config.middleware = [];
  config.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  // add your user config here
  const userConfig = {
    adminserect: process.env.ADMIN_SECRET,
    onerror: {
      accepts() {
        return 'json';
      },

      json(err, ctx) {
        // json hander
        ctx.body = err;
        ctx.status = 500;
      },
    },

    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/cybex-dot-web-config',
        options: { useUnifiedTopology: true, useCreateIndex: true },
      },
    },
    // myAppName: 'egg',
    mysql: {
      client: {
        // host
        host: '127.0.0.1',
        // 端口号
        port: '33061',
        // 用户名
        user: 'root',
        // 密码
        password: 'root',
        // 数据库名
        database: 'polkascan',
        dateStrings: true,
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },

    redis: {
      client: {
        host: '127.0.0.1',
        port: 6379,
        password: '',
        db: 0,
      },
    },

    nodes: {
      wsURL: 'wss://dotws.cybex.io',
    },
    events: {
      trade: [
        'TradePairCreated',
        'OrderCreated',
        'TradeCreated',
        'OrderCanceled',
      ],
      token: ['Issued', 'Transferd', 'Freezed', 'UnFreezed'],
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
