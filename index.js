/* eslint-disable import/no-unresolved */
// process.env.NODE_ENV = 'env-local';
require('app-module-path').addPath(__dirname);
global.rbac = null;
const log = require('logger/logger');
const Config = require('config');
const Server = require('./server');
const SQLDatabase = require('./databases/sqldb');
const PromClient = require('./src/external_communication/prom-client');
const AccessControll = require('src/utils/access-controll');
const ExecuteOnlyOnce = require('src/utils/execute-only-once');

const logData = {
  user_info: '',
  api_origin: '',
};
// require('app-module-path').addPath(__dirname);
logData.log_type = Config.loggingConfig.log_type.info;
log.info(logData, `Running environment ==> ${process.env.NODE_ENV}`);

// Catch unhandling unexpected exceptions
process.on('uncaughtException', (error) => {
  logData.log_type = Config.loggingConfig.log_type.error;
  log.stacktrace = error.stack;
  log.error(logData, `uncaughtException ==> ${error.message}`);
});

// Catch unhandling rejected promises
process.on('unhandledRejection', (reason) => {
  logData.log_type = Config.loggingConfig.log_type.error;
  log.stacktrace = reason.stack;
  log.error(logData, `unhandledRejection ==> ${reason}`);
});

(async () => {
  // Init Database
  const dbConn = await SQLDatabase.init();
  // Start node server
  await Server.init(dbConn);
  // Start the collection of prometheus client metrics
  PromClient.startCollection();
  //initiate the rbac object
  rbac = AccessControll.rbacInit();

  ExecuteOnlyOnce(dbConn);
})();
