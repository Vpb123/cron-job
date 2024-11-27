/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const Joi = require('joi');
const Constants = require('src/utils/constants');

module.exports = (() => {
    return {
        get_running_job_instances: {
          headers: Joi.object({ authorization: Joi.string().required() }).options({ allowUnknown: true }),
            params: Joi.object({
                job_definition_id: Joi.string().required(),
            }),
            failAction: (request, h, err) => {
                return err;
            },
        },
        get_job_instances_history: {
          headers: Joi.object({ authorization: Joi.string().required() }).options({ allowUnknown: true }),
          params: Joi.object({
              job_definition_id: Joi.string().required(),
          }),
          failAction: (request, h, err) => {
              return err;
          },
      }
    };
})();
