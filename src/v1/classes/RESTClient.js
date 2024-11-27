/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */

const Response = require('src/utils/response');
const request = require('request').defaults({ rejectUnauthorized: false });
const log = require('logger/logger');
const Config = require('config');

const logData = {
  api_origin: '',
  user_info: '',
};
const handleResponse = (response, body, success, error) => {
  /**
   * Check if error code is greater than 299
   * else set to 500
   */

  let respData;
  if (typeof body === 'string') {
    try {
      respData = JSON.parse(body);
    } catch (e) {
      logData.log_type = Config.loggingConfig.log_type.error;
      logData.stacktrace = e.stack;
      log.error(logData, 'ERROR => ', e);
      return error(e);
    }
  } else {
    try {
      respData = JSON.parse(JSON.stringify(body));
    } catch (e) {
      logData.log_type = Config.loggingConfig.log_type.error;
      logData.stacktrace = e.stack;
      log.error(logData, '####### >>> 2', e);
      return error(e);
    }
  }
  if (response && response.statusCode > 299) {
    return error(respData);
  }
  console.log(respData)
  return success(respData);
};

/**
 * Class to perform rest request
 * This class is used to call third party APIs
 *
 */
class PerformRequest {
  /**
   * constructor to initialize options
   * @param options
   */
  constructor(options) {
    this.method = options.method;
    this.url = options.url;
    this.data = options.data;
    this.form = options.form;
    this.params = options.params;
    this.query = options.query;
    this.headers = options.headers;
  }

  /**
   * Method to call APIs
   * @param success
   * @param error
   * @returns {*}
   */
  makeRequest(success, error) {
    try {
      /**
       * Options for http request
       * @type {{url: *, method: *}}
       */
      const options = {
        url: this.url,
        method: this.method,
        headers: this.headers,
      };

      if (this.form) {
        options.form = this.form;
        options.headers['Content-Type'] = 'multipart/form-data';
      }
      if (this.data) {
        options.body = this.data;
        options.json = true;
      }

      if (this.query) {
        options.qs = this.query;
      }

      /**
       * Request method having two parameters
       * @param options
       * @param callback
       */

      request(options, (err, response, body) => {
        if (err) {
          logData.log_type = Config.loggingConfig.log_type.error;
          logData.stacktrace = err.stack;
          log.error(logData, 'request ERRR => ', err);

          /**
           * Check if error code is greater than 299
           * else set to 500
           */
          if (response && response.statusCode > 299) {
            /**
             * If success
             */
            return error(Response.sendResponse(false, body, err, response.statusCode));
          }
          return error(Response.sendResponse(false, err, err, 500));
        }
        return handleResponse(response, body, success, error);
      });
    } catch (err) {
      logData.log_type = Config.loggingConfig.log_type.error;
      logData.stacktrace = err.stack;
      log.error(logData, 'Catch ERRR => ', err);
      return error(Response.sendResponse(false, null, err, 500));
    }
  }
}

module.exports = PerformRequest;
