/*
 * Created on Mon Apr 12 2021 10:49:55 AM
 *
 * Created by sudhir.raut@iauro.com
 * Copyright (c) 2021 iauro systems pvt ltd
 */


const Queue = require('../../queues/publish');
const Config = require('config');
const Constants = require('src/utils/constants');
const log = require('logger/logger');

const JobInstanceFactory = require('src/v1/factory/job-instances.factory');

const logData = {
  user_info: '',
  api_origin: '',
};

const connectToQue = (job, job_instance_id) => {
  try {
    console.log('######## Inside the Queue method');
    job.payload = {};//JSON.parse(job.payload);
    Queue.publish('topic', job.payload);
    logData.log_type = Config.loggingConfig.log_type.debug;
    log.debug(logData, 'Publish the data over a Queue', job.id, job_instance_id);
    JobInstanceFactory.FinishRunningJob(job_instance_id, Constants.JOB_TASK_STATUS.COMPLETED);
  } catch (err) {
    JobInstanceFactory.FinishRunningJob(job_instance_id, Constants.JOB_TASK_STATUS.FAILED);
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, 'Error while Message Queue call => ', err);
  }
};

module.exports = {
  connectToQue,
};
