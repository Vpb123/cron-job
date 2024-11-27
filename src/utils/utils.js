/*
 * Created on Fri Aug 09 2019
 *
 * Created by sudhir.raut@iauro.com
 * Copyright (c) 2019 iauro Systems Pvt. Ltd.
 */

/**
 * This function gets the milliseconds only for the date (without time)
 */
const uuid = require('uuid');
const moment = require('moment');

exports.generateUUID = () => uuid();

exports.getUtcDate = () => moment.utc().valueOf();