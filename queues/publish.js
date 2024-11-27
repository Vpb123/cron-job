/* eslint-disable import/no-unresolved */

const to = require('src/utils/promise-handler');
const log = require('logger/logger');
const Config = require('config');

let pubChannel = null;
const offlinePubQueue = [];
let isProducerClosed = false;
let isConnectionClosed = false;

const logData =
  {
    api_origin: '',
    user_info: '',
  };

/**
 * The function which publishes the data on queue.
 * @param {String} exchange
 * @param {String} routingKey
 * @param {*} content
 */
const publish = (routingKey, content) => {
  try {
    let data = null;
    try {
      data = JSON.stringify(content);
    } catch (e) {
      data = content;
    }
    logData.log_type = Config.loggingConfig.log_type.debug;
    log.debug(logData, '>>> In publish', routingKey, content);
    pubChannel.sendToQueue(routingKey, Buffer.from(data), { persistent: true },
      (err, ok) => {
        if (err) {
          logData.log_type = Config.loggingConfig.log_type.error;
          logData.stacktrace = err.stack;
          log.error(logData, '[AMQP] publish', err);
          offlinePubQueue.push([routingKey, content]);
          console.log(">>>>>>> In publish error");
          if(!isProducerClosed){
            pubChannel.close();
            isProducerClosed = true;
          }
          return;
        }
      logData.log_type = Config.loggingConfig.log_type.info;
      log.error(logData, '[AMQP] publish data success', routingKey);
      }
      );
  } catch (e) {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = e.stack;
    log.error(logData, '[AMQP] publish', e.message);
    offlinePubQueue.push([routingKey, content]);
  }
};

const Producer = async (amqpConn) => {
  let err = null;
  let ok = null;
  let ch = null;
  [err, ch] = await to(amqpConn.createConfirmChannel());

  if (err) return;
  ch.on('error', (onErr) => {
    logData.log_type = Config.loggingConfig.log_type.error;
    logData.stacktrace = onErr.stack;
    log.error(logData, '[AMQP] channel error', onErr.message);
  });
  ch.on('close', () => {
    logData.log_type = Config.loggingConfig.log_type.info;
    log.info(logData, '[AMQP] channel closed');
    console.log(">>>>>>>>> Close the ampq connection in producer");
    if(!isConnectionClosed){
      amqpConn.close();
      isConnectionClosed = true;
    }
    return;
  });

  isProducerClosed = false;
  isConnectionClosed = false;
  pubChannel = ch;
  /*setInterval(() => {
    if (offlinePubQueue.length) {
      const [routingKey, content] = offlinePubQueue.shift();
      publish(routingKey, content);
    }
  }, 0);*/
  while (offlinePubQueue.length > 0) {
    console.log(">>>>>>>>>", offlinePubQueue.length);
     if (offlinePubQueue.length) {
    const [routingKey, content] = offlinePubQueue.shift();
     publish(routingKey, content);
     }
   }
};

module.exports = {
  Producer,
  publish,
};
