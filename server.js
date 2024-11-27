const Hapi = require('@hapi/hapi'),
  Config = require('config'),
  log = require('logger/logger'),
  Routes = require('src/v1/routes')
cluster = require('cluster'),
  numberOfCPUs = require('os')
    .cpus().length,
  plugins = require('src/plugins/index'),
  promClient = require('./src/external_communication/prom-client'),
  { verify } = require('src/v1/validations/session.validation');
const ExecuteOnlyOnce = require('src/utils/execute-only-once');
const logData = {
  user_info: '',
  api_origin: '',
};

exports.init = async (database) => {
  try {
    const port = process.env.PORT;
    const host = process.env.IP_PROTOCOL == 'IPV6' ? '::0' : '0.0.0.0';

    /*if (process.env.NODE_ENV !== 'test' && cluster.isMaster) {
      // jira_consumer.jira_consumer();
      for (let i = 0; i < numberOfCPUs; i++) {
        let worker = cluster.fork();
        logData.log_type = Config.loggingConfig.log_type.info;
        log.info(logData, 'worker %s started.', worker.id);
      }
      let mainWorkerId = null;
      cluster.on('listening', (worker, address) => {
        logData.log_type = Config.loggingConfig.log_type.info;
        log.info(logData, 'cluster listening new worker', worker.id);
        if (mainWorkerId === null) {
          logData.log_type = Config.loggingConfig.log_type.info;
          log.info(logData, `Making worker ${worker.id} to main worker`);
          mainWorkerId = worker.id;
          worker.send({ order: 'executeOnlyOnce' });
        }
      });
    } else {*/
      let serverConnectionOptions = {
        // debug: { request: ['error'] },
        port: port,
        host: host,
        state: {
          strictHeader: false,
          ignoreErrors: true
        },
        routes: {
          cors: true,
          timeout: {
            server: 1200000, // 1,200,000 or 20 minutes
            socket: 1300000
          }
        }
      }
      if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'mwc' || process.env.NODE_ENV === 'uat') {
        serverConnectionOptions.routes.cors = {
          origin: [/* 'https://iam-nad.techmahindra.com', 'https://mirai.mwc.r-cloud.io', 'https://cloudu-app.rusdn.linux-networking.rocks', */'*'],
          headers: ['Accept', 'Content-Type'],
          additionalHeaders: ['X-Requested-With']
        };
      }
      const server = new Hapi.Server(serverConnectionOptions);

      //  Setup Hapi Plugins
      const pluginOptions = { database };
      let plugin_promises = [];

      plugins()
        .forEach(pluginName => {
          if (!((Config.env === 'production' || Config.env === 'preprod') && pluginName === 'swagger')) {
            var plugin = require('./src/plugins/' + pluginName);
            logData.log_type = Config.loggingConfig.log_type.info;
            log.info(logData, `Register Plugin ${plugin.info.name} - ${plugin.info.version}`);
            plugin_promises.push(plugin.register(server, pluginOptions));
          }
        });

      await Promise.all(plugin_promises);

      // server.auth.strategy('jwt', 'jwt', { verify });
      // server.auth.default('jwt');

      logData.log_type = Config.loggingConfig.log_type.info;
      log.info(logData, 'All plugins registered successfully.');

      for (const route in Routes) {
        server.route(Routes[route]);
      }

      server.start();
      server.events.on('response', request => {
        if (request.path !== '/v1/metrics' && request.path !== '/health', request.path !== '/v1/tokens') {
          if (request.response) {
            promClient.httpDuration(request, request.response);
            logData.log_type = Config.loggingConfig.log_type.info;
            logData.api_origin = request.url;
            logData.user_info = request.server.app.user ? {
              first_name: request.server.app.user.first_name,
              last_name: request.server.app.user.last_name,
              email_id: request.server.app.user.email_id
            } : "";
            logData.request_info = request.info ? {
              remoteAddress: request.info.remoteAddress,
              id: request.info.id,
              'user-agent': request.headers['user-agent']
            } : "";
            log.info(logData, `${request.method.toUpperCase()} ${request.url.pathname} --> ${request.response.statusCode}`);
          } else {
            logData.api_origin = request.url;
            logData.user_info = request.server.app.user ? {
              first_name: request.server.app.user.first_name,
              last_name: request.server.app.user.last_name,
              email_id: request.server.app.user.email_id
            } : "";
            logData.request_info = request.info ? {
              remoteAddress: request.info.remoteAddress,
              id: request.info.id,
              'user-agent': request.headers['user-agent']
            } : "";
            logData.log_type = Config.loggingConfig.log_type.error;
            log.error(logData, 'No statusCode : ', `${request.method.toUpperCase()} ${request.url.pathname} --> `);
          }
        }
      });

      server.events.on('route', (route) => {
        logData.log_type = Config.loggingConfig.log_type.info;
        log.info(logData, `New route added: ${route.path}`);
      });
      server.events.on('start', (route) => {
        logData.log_type = Config.loggingConfig.log_type.info;
        log.info(logData, 'Node server is running on ==> ', server.info.uri);
      });

      server.events.on('stop', (route) => {
        logData.log_type = Config.loggingConfig.log_type.info;
        log.info(logData, 'Server has been stopped');
      });
      process.on('message', (msg) => {
        logData.log_type = Config.loggingConfig.log_type.info;
        log.info(logData, `Worker ${process.pid} received message from master. ${msg}`);
        if (msg.order === 'executeOnlyOnce') {
          ExecuteOnlyOnce(database);
        }
      });
      return server;
    //}
  } catch (err) {
    logData.log_type = Config.loggingConfig.log_type.error;
    log.stacktrace = err.stack;
    log.error('Error starting server: ', err);
    throw err;
  }
};