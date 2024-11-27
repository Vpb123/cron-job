/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */
const Response = require('src/utils/response');
const RESPONSE_MESSAGES = require('src/utils/response-messages');
const STATUS_CODES = require('src/utils/status-codes');
const to = require('src/utils/promise-handler');
const log = require('logger/logger');
const Config = require('config');
const JobsInterface = require('src/interfaces/job-definitions.interface');
const RunningJobsInterface = require('src/interfaces/running-job-instances.interface');
const JobInstancesHistoryInterface = require('src/interfaces/job-instances-history.interface');
const Constant = require('src/utils/constants');
const parser = require('cron-parser');
const Utils = require('src/utils/utils');

const logData = {
  user_info: '',
  api_origin: '',
};


const FinishRunningJob = async (job_instance_id, status) => {
  try {
    let jobInstance = null;
    const RunningJobs = new RunningJobsInterface();
    const JobInstancesHistory = new JobInstancesHistoryInterface();

    jobInstance = await RunningJobs.findOne({ id: job_instance_id });
    if (jobInstance) {

      let jobHistory = null;
      const history = {
        status,
        id: jobInstance.id,
        job_definition_id: jobInstance.job_definition_id,
        instance_start_date: jobInstance.instance_start_date,
        instance_completion_date: new Date(),
      };

      jobHistory = await JobInstancesHistory.create(history);
      jobInstance = await RunningJobs.destroy({ id: job_instance_id });
      log.info('Job instance completed ', job_instance_id);
    }
  } catch (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, 'Error while create job instances history=> ', err);
  }
};

const GetRunningJobs = async (request, h) => {
try {
  const RunningJobs = new RunningJobsInterface();
  const condition = {
    job_definition_id: request.params.job_definition_id,
  };
  const runningJobs = await RunningJobs.findAll(condition);
  return h.response(Response.sendResponse(true, runningJobs, RESPONSE_MESSAGES.SUCCESS, STATUS_CODES.OK)).code(STATUS_CODES.OK);


} catch (err) {
  logData.log_type = Config.loggingConfig.log_type.error;
      logData.stacktrace = err.stack;
      log.error(logData, 'Error while get running job instances => ', err);
      return h.response(Response.sendResponse(false, err, RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)).code(STATUS_CODES.INTERNAL_SERVER_ERROR);

}
};

const GetInstancesHistory = async (request, h) => {
  try {
    const JobsHistory = new JobInstancesHistoryInterface();
    const condition = {
      job_definition_id: request.params.job_definition_id,
    };
    const historyJobs = await JobsHistory.findAll(condition);
    return h.response(Response.sendResponse(true, historyJobs, RESPONSE_MESSAGES.SUCCESS, STATUS_CODES.OK)).code(STATUS_CODES.OK);
  
  
  } catch (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
        logData.stacktrace = err.stack;
        log.error(logData, 'Error while get history job instances => ', err);
        return h.response(Response.sendResponse(false, err, RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)).code(STATUS_CODES.INTERNAL_SERVER_ERROR);
  
  }
};

module.exports = {
  FinishRunningJob,
  GetRunningJobs,
  GetInstancesHistory,
};
