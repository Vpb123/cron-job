'use strict';
const Constant = require('src/utils/constants');
const init = (sequelize) => {
  let jobTasks = sequelize.db.define('running_job_instances', {
    id: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    job_definition_id: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    instance_start_date: {
      type: sequelize.DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: sequelize.DataTypes.STRING, allowNull: false,
      isIn: [Object.values(Constant.JOB_TASK_STATUS)],
      defaultValue: Constant.JOB_TASK_STATUS.IN_PROGRESS
    }
  });
  return jobTasks;
};

const associate = (models) => {
};
module.exports = {
  init,
  associate
};
