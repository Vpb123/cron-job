/* eslint-disable import/no-unresolved */
/*
 * Created on Mon Aug 14 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2020 Iauro systems Pvt. Limited
 */

const RBAC = require('./classes/rbac');
const Config = require('config');
const log = require('logger/logger');
const logData = {
    api_origin: '',
    user_info: '',
};

const rbacInit = () => {
    let rbac = null;
    logData.log_type = Config.loggingConfig.log_type.info;
    log.info(logData, 'RBAC creation init =====');
    try {
        rbac = new RBAC();
    } catch (ex) {
        logData.log_type = Config.loggingConfig.log_type.error;
        logData.stacktrace = ex.stack;
        log.error(logData, `RBAC Object creation error => ${ex}`);
    }
    return rbac;
}

module.exports = {
    rbacInit
}