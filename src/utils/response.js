/* eslint-disable import/no-unresolved */
/*
 * Created on Mon Oct 19 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2020 iauro Systems Pvt. Ltd.
 */

module.exports = class Response {
    static
    sendResponse(isSuccess, result, message, statusCode) {
      return {
        is_success: isSuccess,
        result,
        message,
        status_code: statusCode,
      };
    }
  };
  