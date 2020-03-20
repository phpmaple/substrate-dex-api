'use strict';

/** @type Egg.EggPlugin */
exports.mysql = {
  enable: true, // 开启
  package: 'egg-mysql', // 对应
};

exports.redis = {
  enable: false, // 开启
  package: 'egg-redis', // 对应
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.httpAuth = {
  enable: true,
  package: 'egg-http-auth',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};
