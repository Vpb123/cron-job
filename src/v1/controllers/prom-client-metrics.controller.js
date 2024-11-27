/* eslint-disable import/no-unresolved */
/*
 * Created on Tue Apr 06 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2019 iauro Systems Pvt. Ltd.
 */

var Register = require('prom-client').register;
const STATUS_CODES = require('src/utils/status-codes');
const Response = require('src/utils/response');
const RESPONSE_MESSAGES = require('src/utils/response-messages');

const GetMetrics = {
    description: 'Get the matrics for the prom client',
    tags: ['api', 'Prom client management'],
    auth: false,
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
    handler: async (request, h) => {
        return h.response(Register.metrics()).code(STATUS_CODES.OK);
    }
  };

const HealthChecker = {
  description: 'Health Checker api',
    tags: ['api', 'Health Check'],
    auth: false,
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
    handler: async (request, h) => {
      return h.response(Response.sendResponse(true, {}, RESPONSE_MESSAGES.SUCCESS, STATUS_CODES.OK))
      .code(STATUS_CODES.OK);;
    }
}

  module.exports = {
    GetMetrics,
    HealthChecker
  }