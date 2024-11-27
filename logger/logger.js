/*
 * Created on Mon Mar 12 2021
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */


var loggingConfig = require("config").loggingConfig;
var bunyan = require("bunyan"); // Bunyan dependency

var logger = bunyan.createLogger({
	name: loggingConfig.name,
	serializers: bunyan.stdSerializers,
	streams: [
		{
			level: loggingConfig.level,
			stream: process.stdout,
		},
		{
			level: bunyan.ERROR,
			stream: process.stdout,
		},
		{
			level: bunyan.DEBUG,
			stream: process.stdout,
		},
		{
			level: bunyan.INFO,
			stream: process.stdout,
		},
	],
});

module.exports = logger;