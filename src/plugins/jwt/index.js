/*
 * Created on Mon Oct 19 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2020 iauro Systems Pvt. Ltd.
 */

const log = require('logger/logger');
const Config = require('config');
const logData =
  {
    api_origin: '',
    user_info: '',
  };

const register = async (server) => {
  try {
    return server.register([
      // eslint-disable-next-line global-require
      require('hapi-auth-jwt2'),
    ]);
  } catch (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, `Error registering hapi-auth-jwt2 plugin: ${err}`);
    return err;
  }
};

module.exports = {
  register,
  info: { name: 'Hapi JWT Plugin', version: '1.0.0' },
};
