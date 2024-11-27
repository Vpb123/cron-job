/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const reportingController = require('src/v1/controllers/job-definitions.controller');

module.exports = [
  { method: 'POST', path: '/v1/jobs', options: reportingController.CreateJob },
  { method: 'GET', path: '/v1/jobs', options: reportingController.GetJobDefinitions },
  { method: 'DELETE', path: '/v1/job/{id}', options: reportingController.DeleteJob },
  { method: 'PUT', path: '/v1/job/{id}', options: reportingController.UpdateJob },
  { method: 'POST', path: '/v1/cron-jobs', options: reportingController.CreateCronJob },
];
