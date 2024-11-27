/* eslint-disable import/no-unresolved */
/*
 * Created on Tue Apr 06 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2019 iauro Systems Pvt. Ltd.
 */

const PromClientMetricsController = require('src/v1/controllers/prom-client-metrics.controller');

module.exports = [
  { method: 'GET', path: '/v1/metrics', options: PromClientMetricsController.GetMetrics },
  { method: 'GET', path: '/health', options: PromClientMetricsController.HealthChecker }
];
