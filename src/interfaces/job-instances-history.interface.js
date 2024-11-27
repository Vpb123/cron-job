/* eslint-disable import/no-unresolved */
/*
 * Created on Wed Mar 17 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const Models = require('src/models');
const to = require('src/utils/promise-handler');

class JobTaskHistory {
    constructor() {
        this.model = Models.db.history;
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

    updateOne(jobTaskHistory, data){
        return jobTaskHistory.update(data);
    }
    
    destroy(condition){
        return this.model.destroy({ where: condition });
    }
    async createOrUpdate(condition, data) {
        let err = null;
        let jobTaskHistory = null;
        [err, jobTaskHistory] = await to(this.findOne(condition));
        if(err){
            return Promise.reject(err);
        }
        if(jobTaskHistory){
            return this.updateOne(jobTaskHistory, data);
        }
        return this.create(data);
    }
    insertMany(list) {
      return this.model.bulkCreate(list);
    }
}

module.exports = JobTaskHistory;