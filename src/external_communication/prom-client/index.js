/*
 * Created on Mon Mar 12 2021
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

var Register = require('prom-client').register;  
var Counter = require('prom-client').Counter;  
var Histogram = require('prom-client').Histogram;  
var Summary = require('prom-client').Summary;  
var ResponseTime = require('response-time');  
const log = require('logger/logger');

/**
 * A Prometheus counter that counts the invocations of the different HTTP verbs
 * e.g. a GET and a POST call will be counted as 2 different calls
 */
const numOfRequests = new Counter({  
    name: 'numOfRequests',
    help: 'Number of requests made',
    labelNames: ['method']
});

/**
 * A Prometheus counter that counts the invocations with different paths
 * e.g. /foo and /bar will be counted as 2 different paths
 */
const pathsTaken = new Counter({  
    name: 'pathsTaken',
    help: 'Paths taken in the app',
    labelNames: ['path']
});

/**
 * A Prometheus summary to record the HTTP method, path, response code and response time
 */
const responses = new Summary({  
    name: 'responses',
    help: 'Response time in millis',
    labelNames: ['method', 'path', 'status']
});

const httpRequestDurationMicroseconds = new Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['route', 'method', 'code'],
    // buckets for response time from 0.1ms to 500ms
    buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
  });
  
/**
 * This funtion will start the collection of metrics and should be called from within in the main js file
 */
const startCollection = function () {  
    log.info(`Starting the collection of metrics, the metrics are available on /metrics`);
    require('prom-client').collectDefaultMetrics();
};

/**
 * This function increments the counters that are executed on the request side of an invocation
 * Currently it increments the counters for numOfPaths and pathsTaken
 */
const requestCounters = function (req) {  
    if (req.path != '/metrics') {
        numOfRequests.inc({ method: req.method });
        pathsTaken.inc({ path: req.path });
    }
    //next();
}

/**
 * This function increments the counters that are executed on the response side of an invocation
 * Currently it updates the responses summary
 */
const responseCounters = ResponseTime(function (req, res, time) {  
    if(req.url != '/metrics') {
        responses.labels(req.method, req.url, res.statusCode).observe(time);
    }
})


const httpDuration = function(request, response){
    if (request.path != '/v1/metrics') {
        let end = response.request.info.received - response.request.info.completed;
        httpRequestDurationMicroseconds.labels(request.path, request.method, response.statusCode).observe(end);
    }
}

module.exports = {
    responseCounters,
    requestCounters,
    startCollection,
    httpDuration
  };