/*
 * Created on Mon Oct 19 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2020 iauro Systems Pvt. Ltd.
 */
const log = require('logger/logger');
const Config = require('config');
const { resolve } = require('path');

const logData =
  {
    api_origin: '',
    user_info: '',
  };
const register = async (server) => {
  try {
    return server.register([
      // eslint-disable-next-line global-require
      require('@hapi/inert'),
      // eslint-disable-next-line global-require
      require('@hapi/vision'),
      {
        // eslint-disable-next-line global-require
        plugin: require('hapi-swagger'),
        options: {
          info: {
            title: 'Cron Service APIs',
            description: 'Cron service Api Documentation',
            version: '1.0',
            termsOfService: 'This documentation is private',
            contact: {
              name: 'Admin',
              // url : '',
              email: 'nad-admin@techmahindra.com',
            },
          },
          host: process.env.HOST,
          basePath: process.env.SWAGGER_BASEPATH || Config.swagger_basepath,
          schemes: ['https', 'http'],
          tags: [
          ],
          grouping: 'tags',
          templates: resolve('public', 'templates'),
        },
      },
    ]);
  } catch (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, `Error registering swagger plugin: ${err}\n`);
    return err;
  }
};

module.exports = {
  register,
  info: { name: 'Swagger Documentation', version: '1.0.0' },
};
