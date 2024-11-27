/* eslint-disable import/no-unresolved */

const Config = require('config');
const amqp = require('amqplib');
const to = require('src/utils/promise-handler');
const log = require('logger/logger');
const CoursesConsumer = require('src/external_communication/rabbitmq/consumers/courses.consumer');
const TrainingsConsumer = require('src/external_communication/rabbitmq/consumers/trainings.consumer');
const AssignmentsConsumer = require('src/external_communication/rabbitmq/consumers/assignments.consumer');
const Publish = require('./publish');

let QUE_PROTOCOL = process.env.QUE_PROTOCOL;
let QUE_HOST = process.env.QUE_HOST;
let QUE_PORT = process.env.QUE_PORT;
let QUE_DIRECTORY = process.env.QUE_DIRECTORY;
let QUE_USERNAME = process.env.QUE_USERNAME;
let QUE_PASSWORD = process.env.QUE_PASSWORD;


/**
 * This is the consumer function
 * @param {*} amqpConn
 */
const logData =
  {
    api_origin: '',
    user_info: '',
  };

let isConnectionClosed = false;
const Consumer = async (amqpConn) => {
  let err = null;
  let ok = null;
  let ch = null;
  [err, ch] = await to(amqpConn.createChannel());
  if (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, 'Error => ', err.message);
    amqpConn.close();
    return err;
  }
  ch.on('error', function(err){
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, '[AMPQ] Channel Error => ', err.message);
  });

  ch.on('close', function(){
    logData.log_type = Config.loggingConfig.log_type.info;
    log.info(logData, '[AMPQ] Channel Close');
    if(!isConnectionClosed){
      isConnectionClosed = true;
      amqpConn.close();
    }
  });

  if (ch) {
    ch.prefetch(10);
    logData.log_type = Config.loggingConfig.log_type.info;
    log.info(logData, 'Channel created...');
    //CoursesConsumer.start(ch);
    //TrainingsConsumer.start(ch);
    AssignmentsConsumer.start(ch);
  }
};


const whenConnected = (amqpConn) => {
  logData.log_type = Config.loggingConfig.log_type.info;
  log.info(logData, '[AMQP] connection opened ==> ');
  Consumer(amqpConn);
  Publish.Producer(amqpConn);
  isConnectionClosed = false;
};

const start = async () => {
  try {
    const opt = { credentials: amqp.credentials.plain(QUE_USERNAME, QUE_PASSWORD), heartbeat: 60 };
    // const opt = { heartbeat: 60 };

    const RabbitMQURL = `${QUE_PROTOCOL}://${QUE_HOST}${(QUE_PORT !== '') ? ':' : ''}${QUE_PORT}${(QUE_DIRECTORY !== '') ? (`/${QUE_DIRECTORY}`) : ''}`;
    const amqpConnObj = amqp.connect(RabbitMQURL, opt);

    // Courses Consumer
    amqpConnObj.then(async (conn) => {
      conn.on('error', (chErr) => {
        logData.log_type = Config.loggingConfig.log_type.error;
        logData.stacktrace = chErr.stack;
        log.error(logData, '[AMQP] Connection error', chErr.message);
      });
      conn.on('close', () => {
        logData.log_type = Config.loggingConfig.log_type.info;
        log.info(logData, '[AMQP] Connection closed');
        log.info(logData, '[AMQP] Connection will restart soon');
        setTimeout(start, 5000);
        return;
      });
      logData.log_type = Config.loggingConfig.log_type.info;
      log.info(logData, '[AMQP] Connection created ==> ');
      whenConnected(conn);
    }).catch((err) => {
      logData.log_type = Config.loggingConfig.log_type.error;
      logData.stacktrace = err.stack;
      log.error(logData, '[AMQP] Error while connection => ', err);
      setTimeout(start, 5000);
      return;
    });
  } catch (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = err.stack;
    log.error(logData, '[AMQP] Error in start try=> ', err);
    setTimeout(start, 5000);
    return;
  }
};

module.exports = {
  start,
};
