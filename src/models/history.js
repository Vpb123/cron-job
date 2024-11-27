'use strict';
const Constant = require('src/utils/constants');
const init = (sequelize) => {
    let jobTasksHistory = sequelize.db.define('history', {
        id: {
            type: sequelize.DataTypes.STRING,
            allowNull: false, primaryKey: true
        },
        job_definition_id: {
            type: sequelize.DataTypes.STRING,
            allowNull: false
        },
        next_execution_date: {
            type: sequelize.DataTypes.DATE,
            allowNull: true
        },
        instance_start_date: {
            type: sequelize.DataTypes.DATE,
            allowNull: true
        },
        instance_completion_date: {
            type: sequelize.DataTypes.DATE,
            allowNull: true
        },
        response: {
            type: sequelize.DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },
        status: {
            type: sequelize.DataTypes.STRING, allowNull: false,
            isIn: [Object.values(Constant.JOB_TASK_STATUS)],
            defaultValue: Constant.JOB_TASK_STATUS.BACKLOG
        },
    });
    return jobTasksHistory;
};

const associate = (models) => {
};
module.exports = {
    init,
    associate
};
