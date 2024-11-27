/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const Models = require('src/models');
const to = require('src/utils/promise-handler');

class JobTask {
    constructor() {
        this.model = Models.db.running_job_instances;
    }

    create(data) {
        return this.model.create(data);
    }

    findOne(condition, orderBy) {
        return this.model.findOne({ where: condition, order: orderBy ? orderBy : [] });
    }

    findAll(condition) {
        return this.model.findAll({ where: condition });
    }

    updateOne(jobTask, data) {
        return jobTask.update(data);
    }

    destroy(condition) {
        return this.model.destroy({ where: condition });
    }
    async createOrUpdate(condition, data) {
        let err = null;
        let jobTask = null;
        [err, jobTask] = await to(this.findOne(condition));
        if (err) {
            return Promise.reject(err);
        }
        if (jobTask) {
            return this.updateOne(jobTask, data);
        }
        return this.create(data);
    }
    insertMany(list) {
      return this.model.bulkCreate(list);
    }
}

module.exports = JobTask;