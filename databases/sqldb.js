/*
 * Created on Mon Mar 12 2021
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2021 iauro Systems Pvt. Ltd.
 */

const { Sequelize, DataTypes } = require('sequelize');
const log = require('logger/logger');
const to = require('src/utils/promise-handler');
const Models = require('src/models');

const logData = {
    user_info: '',
    api_origin: '',
};

exports.init = async () => {

    let connection_uri = '';

    let dbUsername = process.env.DB_USERNAME;
    let dbPassword = process.env.DB_PASSWORD;
    let dbname = process.env.DB_DBNAME;
    let dbHost = process.env.DB_HOST;

    const db = new Sequelize(dbname, dbUsername, dbPassword, {
        host: dbHost,
        dialect: 'postgres'
    });

    try {
        db.authenticate(connection_uri);
        await Models.init({ db, DataTypes });
        log.info('Connection has been established successfully');
    }
    catch (ex) {
        log.error("Error while autheticate the sequelize connection");
    }


    process.on('SIGINT', () => {
        try {
            db.close()
            log.info('Sequelize default connection disconnected through app termination');
            process.exit(0);
        } catch (ex) {
            log.info('Sequelize default connection not disconnected through app termination');
        }
    });

    return { db, DataTypes };
};