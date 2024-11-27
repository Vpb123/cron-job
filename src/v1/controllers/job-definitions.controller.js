/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const Validations = require('src/v1/validations/job-definitions.validation');
const jobsFactory = require('src/v1/factory/job-definitions.factory');

const CreateJob = {
    description: 'Create the job api',
    tags: ['api', 'Job Management'],
    // auth: 'jwt',
    validate: Validations.create_job,
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
    handler: async (request, h) => jobsFactory.CreateJob(request, h),
};

const GetJobDefinitions = {
    description: 'Get job definitions',
    tags: ['api', 'Job Management'],
    // auth: 'jwt',
    validate: Validations.get_jobs,
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
    handler: async (request, h) => jobsFactory.GetJobDefinitions(request, h),
};

const DeleteJob = {
    description: 'Delete job definitions',
    tags: ['api', 'Job Management'],
    // auth: 'jwt',
    validate: Validations.delete_job,
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
    handler: async (request, h) => jobsFactory.DeleteJob(request, h),
};

const UpdateJob = {
    description: 'Update job definitions',
    tags: ['api', 'Job Management'],
    // auth: 'jwt',
    validate: Validations.update_job,
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
    handler: async (request, h) => jobsFactory.UpdateJob(request, h),
};

const CreateCronJob = {
    description: 'Create the cron job api',
    tags: ['api', 'Job Management'],
    // auth: 'jwt',
    validate: Validations.create_cron_job,
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
    handler: async (request, h) => jobsFactory.CreateCronJob(request, h),
};

module.exports = {
    CreateJob,
    GetJobDefinitions,
    DeleteJob,
    UpdateJob,
    CreateCronJob,
};
