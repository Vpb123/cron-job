'use strict';

var fs = require('fs');
var path = require('path');
const log = require('logger/logger');
var db = {};

const logData = {
    user_info: {},
    api_origin: {},
};

const init = (sequelize) => {
    fs.readdirSync(__dirname).forEach((file) => {
        /* If its the current file ignore it */
        if (file === 'index.js') {
            return;
        }
        /* Store module with its name (from filename) */
        // eslint-disable-next-line global-require
        const model = require(path.resolve(__dirname, file));
        if (!model.init) {
            log.error(logData, 'Error while initiate', path.basename(file, '.js'), 'Model');
            return;
        }
        db[path.basename(file, '.js')] = model.init(sequelize);
    });
    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
    return sequelize.db.sync();
};


module.exports = {
  db,
  init,
};
