'use strict';
/* eslint-disable import/no-unresolved */
/*
 * Created on Mon Aug 14 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2020 Iauro systems Pvt. Limited
 */

const roles = require('./roles');
const Permission = require('./permission');
class RBAC {
    constructor() {
        try {
            this.init(roles);
        } catch (ex) {
            throw ex;
        }

    }
    //Init once in a lifetime
    init(roles) {
        if (typeof roles !== 'object') {
            throw new TypeError('Expected an object as input');
        }

        this.roles = roles;
        let map = {};
        Object.keys(roles).forEach(role => {
            map[role] = {
                can: {}
            };
            if (roles[role].inherits) {
                map[role].inherits = roles[role].inherits;
            }
            //Check the special conditions for the access
            roles[role].can.forEach(operation => {
                let key = null;
                if (typeof operation === 'string') {
                    key = operation;
                } else if (typeof operation.name === 'string') {
                    key = operation.name;
                }
                map[role].can[key] = {
                    when: operation.when ? operation.when : () => { return true },
                    features: operation.features ? operation.features : '*'
                }
                /*if (typeof operation === 'string') {
                    map[role].can[operation] = {
                        when: true
                    };
                } else if (typeof operation.name === 'string'
                    && typeof operation.when === 'function') {
                    map[role].can[operation.name] = {
                        when: operation.when,
                        attributes: operation.attributes? operation.attributes: ['*']
                    };
                }*/
            });

        });

        this.roles = map;
        console.log(JSON.stringify(this.roles));
    }

    can(role, operation, params) {
        if (!this.roles[role]) {
            return false;
        }

        let $role = this.roles[role];

        if ($role.can[operation]) {
            //Only the string return it to true
            /*if (typeof $role.can[operation] !== 'object') {
                return true;
            }*/
            // If the function check passes return true
            if ($role.can[operation].when(params)) {
                return true;
            }
        }

        //Now check if we have the parent access if any
        if (!$role.inherits || $role.inherits.length < 1) {
            return false;
        }
        //Check all the inherits roles
        return $role.inherits.some(childRole => this.can(childRole, operation, params));
    }

    grant(userRoles, operation, params) {
        let permission = new Permission();
        let featuresArr = [];
        userRoles.forEach(role => {
            const canAccess = this.can(role, operation, params);
            if (canAccess) {
                permission.setGranted(canAccess);
                if (this.roles[role].can[operation] === undefined) {
                    //User has all the access if it is granted but not found the operation
                    //Inherited opration
                    featuresArr.push('*');
                } else {
                    featuresArr.push(this.roles[role].can[operation].features);
                }

            }
        });
        let obj = null;
        if (featuresArr.length === 0) {
            obj = null;
        }
        else if (featuresArr.indexOf('*') > -1) {
            obj = '*';
        } else {
            obj = {};
            featuresArr.forEach(feature => {
                Object.keys(feature).forEach(key => {
                    if (obj[key]) {
                        obj[key] = obj[key].concat(feature[key]);
                    } else {
                        obj[key] = feature[key];
                    }
                });
            });
        }
        permission.setFeatures(obj);
        return permission;
    }

}

module.exports = RBAC;