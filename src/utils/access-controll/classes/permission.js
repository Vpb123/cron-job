'use strict'
/* eslint-disable import/no-unresolved */
/*
 * Created on Mon Aug 14 2020
 *
 * Created by akshay.gadhave@iauro.com
 * Copyright (c) 2020 Iauro systems Pvt. Limited
 */

class Permission {

    constructor() {
        this.granted = false;
        this.features = null;
    }
    setGranted(granted) {
        this.granted = granted;
    }

    setFeatures(features) {
        this.features = features;
    }
}

module.exports = Permission;