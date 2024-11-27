/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const JobInstancesController = require('src/v1/controllers/job-instances.controller');

module.exports = [
  { method: 'GET', path: '/v1/jobs/instances/running/{job_definition_id}', options: JobInstancesController.getRunningJobInstances },
  { method: 'GET', path: '/v1/jobs/instances/history/{job_definition_id}', options: JobInstancesController.getJobInstancesHistory },

];
