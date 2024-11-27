/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const to = require('src/utils/promise-handler');
const log = require('logger/logger');
const Config = require('config');
const { Op } = require('sequelize');

const JobDefinitionFactory = require('src/v1/factory/job-definitions.factory');
const ApiCallMS = require('src/external_communication/connect.REST');
const MessageQueue = require('src/external_communication/connect.queue');

const JobDefinitionsInterface = require('src/interfaces/job-definitions.interface');
const RunningJobInstancesInterface = require('src/interfaces/running-job-instances.interface');
const Utils = require('src/utils/utils');
const sanitize = require('mongo-sanitize');

const logData = {
  api_origin: '',
  user_info: '',
};

const OperationMethodCall = (job, jobInstance) => {
  switch (job.operation_method) {
    case 'REST':
      ApiCallMS.connectToMs(job, jobInstance.id);
      break;
    case 'gRPC':
      log.info('#*#*#*#*#*#* This protocol is yet to be implemented #*#*#*#*#*#*');
      break;
    case 'Queue':
      MessageQueue.connectToQue(job, jobInstance.id);
      break;
  }
};

const observeJob = async () => {
  try {
    let err = null;
    const JobDefinitions = new JobDefinitionsInterface();
    const RunningJobInstances = new RunningJobInstancesInterface();
    const curDate = new Date();
    const condition = {
      is_active: true,
      next_execution_date: { [Op.lte]: curDate },
    };
    const orderBy = [['next_execution_date', 'ASC']];
    const UpcomingJobs = await JobDefinitions.findAll(condition, orderBy);
    const runningJobs = [];
    UpcomingJobs.forEach(async job => {
      if (!job.allow_parallel_running_instances) {
        const runningJob = await RunningJobInstances.findOne({ job_definition_id: sanitize(job.id) });
        if (runningJob) {
          return;
        }
      }

      const runJob = {
        id: Utils.generateUUID(),
        job_definition_id: job.id,
        instance_start_date: new Date(),
      };
      let options = {
        tz: job.time_zone,
        currentDate: job.next_execution_date,
        endDate: job.valid_till,
      };
      const next_execution_date = job.frequency === 'once' ? null : JobDefinitionFactory.getNextSchedule(job.schedule, options).toString();
      JobDefinitions.updateOne({id: job.id}, { next_execution_date }).then(() => {
        log.info('Job updated ==> ', job.id);
      }).catch(err => {
        log.error('ERROR => ', err);
      });

      // Operation to be performed for each job instance
      OperationMethodCall(job, runJob);
      // Create an array of new instances and insert into the db
      runningJobs.push(runJob);
    });

    const runningJobsRes = await RunningJobInstances.insertMany(runningJobs);

  } catch (err) {
    if (err) {
      logData.log_type = Config.loggingConfig.log_type.error;
      logData.stacktrace = err.stack;
      log.error(logData, 'Error while get job tasks=> ', err);
      return err;
    }
  }
};

module.exports = {
  observeJob
};
