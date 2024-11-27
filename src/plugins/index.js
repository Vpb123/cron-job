/*
 * Created on Mon Oct 19 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2020 iauro Systems Pvt. Ltd.
 */

const { readdirSync } = require('fs');

module.exports = () => readdirSync(__dirname, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);
