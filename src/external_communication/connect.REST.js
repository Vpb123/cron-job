/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 19 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const RESTClient = require('src/utils/RESTClient');
const Constants = require('src/utils/constants');
const Config = require('config');
const log = require('logger/logger');

const JobInstanceFactory = require('src/v1/factory/job-instances.factory');

const logData = {
  user_info: '',
  api_origin: '',
};

const connectToMs = (job, job_instance_id) => {
  job.payload = job.payload ? job.payload: {};
  const options = {
    ...(job.method !== 'GET') && { data: job.payload },
    url: job.url,
    method: job.method,
    headers: job.headers,
  };
  logData.log_type = Config.loggingConfig.log_type.debug;
  log.debug(logData, 'Call the api for MS', options);

  RESTClient(options).then(() => {
    JobInstanceFactory.FinishRunningJob(job_instance_id, Constants.JOB_TASK_STATUS.COMPLETED);
  }).catch((err) => {
    JobInstanceFactory.FinishRunningJob(job_instance_id, Constants.JOB_TASK_STATUS.FAILED);
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, 'Error while REST API call => ', err);
  });
};

module.exports = {
  connectToMs,
};
