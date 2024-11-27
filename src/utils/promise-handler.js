/* eslint-disable import/no-unresolved */

/*
 * Created on Mon Oct 19 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2020 iauro Systems Pvt. Ltd.
 */

/**
  * Function to handle errors in promises
  */
 module.exports = (promise) => promise.then((data) => [null, data])
 .catch((err) => [err]);
