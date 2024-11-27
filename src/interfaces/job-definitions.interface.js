/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const Models = require('src/models');
const to = require('src/utils/promise-handler');

class Job {
    constructor() {
        this.model = Models.db.job_definitions;
    }

    create(data) {
        return this.model.create(data);
    }

    findOne(condition) {
        return this.model.findOne({ where: condition });
    }

    findAll(condition) {
        return this.model.findAll({ where: condition });
    }

    updateOne(condition, data) {
        return this.model.update(data, { where: condition });
    }
    
    async createOrUpdate(condition, data) {
        let err = null;
        let job = null;
        [err, job] = await to(this.findOne(condition));
        if (err) {
            return Promise.reject(err);
        }
        if (job) {
            return this.updateOne(job, data);
        }
        return this.create(data);
    }

    destroy(condition) {
        return this.model.destroy({ where: condition });
    }
}

module.exports = Job;