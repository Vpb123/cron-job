/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */
const Config = require('config');
const { Op } = require('sequelize');
const parser = require('cron-parser');

const Response = require('src/utils/response');
const RESPONSE_MESSAGES = require('src/utils/response-messages');
const STATUS_CODES = require('src/utils/status-codes');
const to = require('src/utils/promise-handler');
const log = require('logger/logger');
const JobDefinitionsInterface = require('src/interfaces/job-definitions.interface');
const Utils = require('src/utils/utils');
const sanitize = require('mongo-sanitize');

const logData = {
  user_info: '',
  api_origin: '',
};

const getNextSchedule = (cron, options) => {
  try {
    const interval = parser.parseExpression(cron, options);
    let dt = interval.next();
    return dt;
  } catch (err) {
    console.log('Error: ' + err.message);
    return null;
  }
};

const CreateJob = async (request, h) => {
  try {
    logData.api_origin = request.url;
    logData.user_info = request.headers.authorization;
    let err = null;
    let jobData = null;
    const JobDefinitions = new JobDefinitionsInterface();
    jobData = await JobDefinitions.findOne({ name: sanitize(request.payload.name) });
    if (jobData) {
      return h.response(Response.sendResponse(false, null, RESPONSE_MESSAGES.JOB_EXISTS, STATUS_CODES.BAD_REQUEST)).code(STATUS_CODES.BAD_REQUEST);
    }

    jobData = JSON.parse(JSON.stringify(request.payload));
    jobData.id = Utils.generateUUID();
    let options = {
      tz: jobData.time_zone,
      currentDate: jobData.valid_from,
      endDate: jobData.valid_till,
    };
    
    jobData.next_execution_date = jobData.frequency === 'once' ? new Date(jobData.schedule) : getNextSchedule(jobData.schedule, options);
    let job = await JobDefinitions.create(jobData);

    return h.response(Response.sendResponse(true, job, RESPONSE_MESSAGES.SUCCESS, STATUS_CODES.CREATED)).code(STATUS_CODES.CREATED);
  } catch (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, 'Error while create job => ', err);
    return h.response(Response.sendResponse(false, err, RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR))
      .code(STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

const GetJobDefinitions = async (request, h) => {
  let err = null;
  let jobs = null;
  const jobsInterface = new JobDefinitionsInterface();
  const condition = {
    is_active: true
  };
  const orderBy = [['createdAt', 'DES']];
  [err, jobs] = await to(jobsInterface.findAll(condition, orderBy));
  if (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, 'Error while get job tasks=> ', err);
    return h.response(Response.sendResponse(false, err, RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)).code(STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
  return h.response(Response.sendResponse(true, jobs, RESPONSE_MESSAGES.SUCCESS, STATUS_CODES.OK)).code(STATUS_CODES.OK);

};

const DeleteJob = async (request, h) => {
  try {
    logData.api_origin = request.url;
    logData.user_info = request.headers.authorization;
    let err = null;
    let jobData = null;
    const JobDefinitions = new JobDefinitionsInterface();
    jobData = await JobDefinitions.findOne({ id: sanitize(request.params.id) });
    if (jobData) {
      let job = await JobDefinitions.destroy({ id: request.params.id });
      return h.response(Response.sendResponse(true, job, RESPONSE_MESSAGES.SUCCESS, STATUS_CODES.OK)).code(STATUS_CODES.OK);
    }

    return h.response(Response.sendResponse(false, null, RESPONSE_MESSAGES.JOB_NOT_FOUND, STATUS_CODES.BAD_REQUEST)).code(STATUS_CODES.BAD_REQUEST);
  }
  catch (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, 'Error while create job => ', err);
    return h.response(Response.sendResponse(false, err, RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR))
      .code(STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

const UpdateJob = async (request, h) => {
  try {
    logData.api_origin = request.url;
    logData.user_info = request.headers.authorization;
    let err = null;
    let jobData = null;
    const JobDefinitions = new JobDefinitionsInterface();
    jobData = await JobDefinitions.findOne({ id: sanitize(request.params.id) });
    if (jobData) {
      let job = await JobDefinitions.updateOne({ id: request.params.id },request.payload);
      return h.response(Response.sendResponse(true, job, RESPONSE_MESSAGES.SUCCESS, STATUS_CODES.OK)).code(STATUS_CODES.OK);
    }

    return h.response(Response.sendResponse(false, null, RESPONSE_MESSAGES.JOB_NOT_FOUND, STATUS_CODES.BAD_REQUEST)).code(STATUS_CODES.BAD_REQUEST);
  }
  catch (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, 'Error while updating job => ', err);
    return h.response(Response.sendResponse(false, err, RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR))
      .code(STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

const CreateCronJob = async (request, h) => {
  try {
      logData.api_origin = request.url;
      logData.user_info = request.headers.authorization;
      let err = null;
      let jobData = null;
      let jobDetails = null;
      let job = null;
      let options = null;
      const JobDefinitions = new JobDefinitionsInterface();
      jobDetails = await JobDefinitions.findOne({ name: sanitize(request.payload.name) });
      jobData = JSON.parse(JSON.stringify(request.payload));
      jobData.id = Utils.generateUUID();
      options = {
        tz: jobData.time_zone,
        currentDate: jobData.valid_from,
        endDate: jobData.valid_till,
      };
      jobData.next_execution_date = jobData.frequency === 'once' ? new Date(jobData.schedule) : getNextSchedule(jobData.schedule, options);
      
      if (jobDetails) {
        job = await JobDefinitions.updateOne({ name: request.payload.name },jobData);
        return h.response(Response.sendResponse(true, job, RESPONSE_MESSAGES.SUCCESS, STATUS_CODES.UPDATED)).code(STATUS_CODES.OK);
      }

      job = await JobDefinitions.create(jobData);
      return h.response(Response.sendResponse(true, job, RESPONSE_MESSAGES.SUCCESS, STATUS_CODES.CREATED)).code(STATUS_CODES.CREATED);
  } 
  catch (err) {
      logData.log_type = Config.loggingConfig.log_type.error;
      logData.stacktrace = err.stack;
      log.error(logData, 'Error while create job => ', err);
      return h.response(Response.sendResponse(false, err, RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR))
      .code(STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  CreateJob,
  getNextSchedule,
  GetJobDefinitions,
  DeleteJob,
  UpdateJob,
  CreateCronJob,
};
