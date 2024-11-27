'use strict';
const Constant = require('src/utils/constants');
const init = (sequelize) => {
  const jobs = sequelize.db.define('job_definitions', {
    id: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: sequelize.DataTypes.STRING,
      allowNull: false
    },
    schedule: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    frequency: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      defaultValue: 'repeat'
    },
    time_zone: {
      type: sequelize.DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: sequelize.DataTypes.STRING,
      allowNull: true
    },
    method: {
      type: sequelize.DataTypes.STRING,
      allowNull: true,
      isIn: [Object.values(Constant.HTTP_METHODS)]
    },
    payload: {
      type: sequelize.DataTypes.JSON,
      allowNull: true
    },
    ms: {
      type: sequelize.DataTypes.STRING,
      allowNull: true,
    },
    headers: {
      type: sequelize.DataTypes.JSON,
      allowNull: true
    },
    operation_method: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      isIn: Constant.TARGET_METHODS,
    },
    is_active: {
      type: sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    valid_from: {
      type: sequelize.DataTypes.DATE,
      allowNull: true
    },
    valid_till: {
      type: sequelize.DataTypes.DATE,
      allowNull: true
    },
    next_execution_date: {
      type: sequelize.DataTypes.DATE,
      allowNull: true
    },
    allow_parallel_running_instances: {
      type: sequelize.DataTypes.BOOLEAN,
      defaultValue: true
    },
  });
  return jobs;
};

const associate = (models) => {
};
module.exports = {
  init,
  associate
};