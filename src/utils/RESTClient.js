/* eslint-disable import/no-unresolved */

const CallAPI = require('src/v1/classes/RESTClient');

module.exports = (options) => new Promise((resolve, reject) => {
  const data = new CallAPI(options);
  data.makeRequest(resolve, reject);
});
