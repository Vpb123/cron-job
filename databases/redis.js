/*
 * Created on Mon Mar 12 2021
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

// eslint-disable-next-line no-undef,import/no-unresolved
const log = require('logger/logger');
const Redis = require('ioredis');
const Config = require('config');

const logData = {
  user_info: '',
  api_origin: '',
};

let redisClient;
let redis = null;
// Create and redis client instance
exports.init = () => {
  
  try {
    if(redis){
      return redis;
    }
    if (process.env.REDIS_CONNECTION_STRATEGY === "cluster") {
      log.info(logData, `Redis Sentinel connection`);
      redis = new Redis({
        sentinels: [
          { host: process.env.REDIS_SETINEL1, port: process.env.SENTINEL_PORT },
          { host: process.env.REDIS_SETINEL2, port: process.env.SENTINEL_PORT }
        ],
        family: process.env.REDIS_FAMILY,
        name: 'mymaster' ,
        role: 'master',
      });
    } else {
      log.info(logData, `Redis normal connection`);
      redis = new Redis({
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST1,
        password: process.env.REDIS_PASSWORD,
        family: process.env.REDIS_FAMILY,
        retryStrategy: times => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });
    }
    return redis;
  } catch (err) {
    logData.log_type = Config.loggingConfig.log_type.info;
    logData.stacktrace = err.stack;
    log.error(logData, `ERROR => ${err}`);
  }
};

process.on('SIGINT', () => {
  if(redis){
    redis.quit();
  }
  log.info(logData, `Redis connection is closed`);
});

exports.redisClient = redisClient;