/*
 * Created on Fri Mar 12 2021
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

fs.readdirSync(__dirname).forEach((file) => {
  /* If its the current file ignore it */
  if (file === 'index.js') {
    return;
  }

  /* Prepare empty object to store module */
  const mod = {};

  /* Store module with its name (from filename) */
  // eslint-disable-next-line global-require
  mod[path.basename(file, '.js')] = require(path.resolve(__dirname, file));

  /* Extend module.exports (in this case - underscore.js, can be any other) */
  _.extend(module.exports, mod);
});
