/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */


const { CronJob } = require('cron');
const Config = require('config');
const log = require('logger/logger');
const ObserverCronFactory = require('src/v1/factory/observer-cron.factory');
const logData = {
  api_origin: '',
  user_info: '',
};

/**
 * This utility function is mainly for the one time activites.
 * When we use cluster npm package in that case many functions
 * executes as many times as CPU cores are there.
 * For e.g we have a cron job to send notifications,
 * if we use cluster then notification utility function will send notifications multiple times.
 * To avoid this the following approach is used.
 */

const observerCron = () => new CronJob(Config.cron_jobs.observer_cron, () => {
  logData.log_type = Config.loggingConfig.log_type.info;
  log.info(logData, `********************** Observer Cron =>  ${new Date()} **********************`);
  ObserverCronFactory.observeJob();
}, null, true, "Europe/London");

module.exports = (dbConn) => {
  observerCron();
  logData.log_type = Config.loggingConfig.log_type.info;
  log.info(logData, '************************************** IN EXECUTE ONCE... **************************************');
};
