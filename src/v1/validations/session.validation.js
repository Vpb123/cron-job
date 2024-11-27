/*
 * Created on Fri Mar 12 2021
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const log = require('logger/logger');
const to = require('src/utils/promise-handler');
const Redis = require('databases/redis');
const Config = require('config');
const JWTAuth = require('src/utils/auth');

const logData = {
  api_origin: '',
  user_info: '',
};

exports.verify = async (decoded, request) => {
  logData.user_info = request.headers.authorization;
  logData.api_origin = request.url;
  try {
    const redisClient = Redis.init();
    let err = null;
    let userSession = null;
    const tokenData = JWTAuth.verifyToken(request.headers.authorization);
    tokenData.session_state = tokenData.session_state ? tokenData.session_state.replace(/-/g, '_') : null;
    const sessionKey = decoded.tenant_id ? `${Config.env}_${decoded.tenant_id}_${tokenData.email_id}${(tokenData.session_state) ? `_${tokenData.session_state}`: ''}` : `${Config.env}_${tokenData.email_id}${(tokenData.session_state) ? `_${tokenData.session_state}`: ''}`;
    [err, userSession] = await to(redisClient.hgetall(sessionKey));
    if (err) {
      logData.log_type = Config.loggingConfig.log_type.error;
      logData.stacktrace = err.stack;
      log.error(logData, 'ERROR => ', err);
      return { isValid: false, credentials: err };
    }
    if (Object.entries(userSession).length > 0) {
      if (userSession.email_id === tokenData.email_id) {
        request.server.app.user = decoded;
        return { isValid: true, credentials: tokenData };
      }
      log.error('Session ERROR => 2 ', err);
      return { isValid: false, credentials: {} };
    }
    log.error('Session ERROR => 3 ', err);
    return { isValid: false, credentials: {} };
  } catch (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, 'ERRRRRR ----> ', err);
    return { isValid: false, credentials: err };
  }
};
