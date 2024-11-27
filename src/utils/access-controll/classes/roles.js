/* eslint-disable import/no-unresolved */
/*
 * Created on Mon Aug 14 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2020 Iauro systems Pvt. Limited
 */
const Constants = require('src/utils/constants');

/**
 * This is the roles architecure 
 * The name should be the string always
 * The when should be return the boolean value only
 * the features keys will be array only then this roles will grant the conditions,
 * 'can' should be the array
 * User can not inherited the parent to child 
 */
module.exports = {
    'Super Admin': {
        can: [],
        inherits: ['Admin']
    },
    'Admin': {
        can: [],
        inherits: ['Author', 'Publisher', 'Learner']
    },
    'Author': {
        can: [],
        inherits: ['Learner']
    },
    'Publisher': {
        can: [],
        inherits: ['Learner']
    },
    'Learner': {
        can: ['webinar:read']
    }
}