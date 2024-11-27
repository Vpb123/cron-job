/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const Validations = require('src/v1/validations/job-instances.validation');
const JobInstancesFactory = require('src/v1/factory/job-instances.factory');

const getRunningJobInstances = {
    description: 'Get running job instances',
    tags: ['api', 'Job Instances'],
    // auth: false,
    validate: Validations.get_running_job_instances,
    plugins: {
        'hapi-swagger': {
            responses: {
                200: { description: 'Success' },
                400: { description: 'Bad Request' },
                401: { description: 'Invalid credentials' },
                500: { description: 'Exception at server side' },
            },
        },
    },
    handler: async (request, h) => JobInstancesFactory.GetRunningJobs(request, h),
};

const getJobInstancesHistory = {
  description: 'Get job instances history',
  tags: ['api', 'Job Instances'],
  // auth: false,
  validate: Validations.get_job_instances_history,
  plugins: {
      'hapi-swagger': {
          responses: {
              200: { description: 'Success' },
              400: { description: 'Bad Request' },
              401: { description: 'Invalid credentials' },
              500: { description: 'Exception at server side' },
          },
      },
  },
  handler: async (request, h) => JobInstancesFactory.GetInstancesHistory(request, h),
};

module.exports = {
    getRunningJobInstances,
    getJobInstancesHistory,
};
