/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const Joi = require('joi');
const Constants = require('src/utils/constants');
const iso = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/;

module.exports = (() => {
    return {
        create_job: {
            headers: Joi.object({ authorization: Joi.string().required() }).options({ allowUnknown: true }),
            payload: Joi.object({
                name: Joi.string().required(),
                schedule: Joi.any().when('frequency', { is: 'once', then: Joi.string().regex(iso).required(), otherwise: Joi.string().required() }),
                frequency: Joi.string().valid('repeat', 'once').default('repeat'),
                time_zone: Joi.string().default('Asia/Kolkata'),
                url: Joi.string().required(),
                method: Joi.string().required().valid(...Object.values(Constants.HTTP_METHODS)),
                payload: Joi.object().required(),
                ms: Joi.string().required().valid(...Object.values(Constants.MS)),
                operation_method: Joi.string().valid('REST', 'gRPC', 'Queue').required(),
                headers: Joi.object({ authorization: Joi.string() }).options({ allowUnknown: true }),
                is_active: Joi.boolean().required().default(true),
                valid_from: Joi.date(),
                valid_till: Joi.date(),
                allow_parallel_running_instances: Joi.boolean().default(true),
            }),
            failAction: (request, h, err) => {
                return err;
            },
        },
        get_jobs: {
            headers: Joi.object({ authorization: Joi.string().required() }).options({ allowUnknown: true }),
            failAction: (request, h, err) => {
                return err;
            },
        },
        delete_job: {
            headers: Joi.object({ authorization: Joi.string().required() }).options({ allowUnknown: true }),
            params: Joi.object({
                id: Joi.string().required()
            }),
            failAction: (request, h, err) => {
                return err;
            },
        },
        update_job: {
            headers: Joi.object({ authorization: Joi.string().required() }).options({ allowUnknown: true }),
            params: Joi.object({
                id: Joi.string().required()
            }),
            payload: Joi.object({
                name: Joi.string().allow(''),
                schedule:  Joi.string().allow(''),
                frequency: Joi.string().valid('repeat', 'once'),
                time_zone: Joi.string().default('Asia/Kolkata').allow(''),
                url: Joi.string().allow(''),
                method: Joi.string().allow('').valid(...Object.values(Constants.HTTP_METHODS)),
                payload: Joi.object().allow(''),
                ms: Joi.string().allow('').valid(...Object.values(Constants.MS)),
                operation_method: Joi.string().valid('REST', 'gRPC', 'Queue').allow(''),
                headers: Joi.object({ authorization: Joi.string().required() }).options({ allowUnknown: true }).allow(''),
                is_active: Joi.boolean().allow('').default(true),
                valid_from: Joi.date().allow(''),
                valid_till: Joi.date().allow(''),
                allow_parallel_running_instances: Joi.boolean().default(true).allow(''),
            }),
            failAction: (request, h, err) => {
                return err;
            },
        },
        create_cron_job: {
            headers: Joi.object({ authorization: Joi.string().required() }).options({ allowUnknown: true }),
            payload: Joi.object({
                name: Joi.string().required(),
                schedule: Joi.any().when('frequency', { is: 'once', then: Joi.string().regex(iso).required(), otherwise: Joi.string().required() }),
                frequency: Joi.string().valid('repeat', 'once').default('repeat'),
                time_zone: Joi.string().default('Asia/Kolkata'),
                url: Joi.string().required(),
                method: Joi.string().required().valid(...Object.values(Constants.HTTP_METHODS)),
                payload: Joi.object().required(),
                ms: Joi.string().required().valid(...Object.values(Constants.MS)),
                operation_method: Joi.string().valid('REST', 'gRPC', 'Queue').required(),
                headers: Joi.object({ authorization: Joi.string() }).options({ allowUnknown: true }),
                is_active: Joi.boolean().required().default(true),
                valid_from: Joi.date(),
                valid_till: Joi.date(),
                allow_parallel_running_instances: Joi.boolean().default(true),
            }),
            failAction: (request, h, err) => {
                return err;
            },
        },
    };
})();
