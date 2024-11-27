let HOST = process.env.HOST;
let PORT = process.env.PORT;
let DIRECTORY = process.env.SWAGGER_BASEPATH;
let PROTOCOL = process.env.PROTOCOL;

exports.HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

exports.CONTENT_TYPE = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  FORM_DATA: 'multipart/form-data',
  XML: 'application/xml',
  TEXT_XML: 'text/xml',
};

exports.MS_URLS = {
  ALL_MS_BASE_PATH: `${PROTOCOL}://${HOST}`,
};

exports.ZADARA_FOLDERS = {
  PUBLIC: '/app/nfs-vol',
};

exports.MS = {
  RBAC: 'rbac',
  UPSKILL: 'upskill',
  NOTIFICATION: 'notifications',
  PODCAST: 'podcast'
};

exports.TARGET_METHODS = ['REST', 'gRPC', 'Queue'];

exports.JOB_TASK_STATUS = {
  BACKLOG: 'backlog',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  FAILED: 'failed'
};