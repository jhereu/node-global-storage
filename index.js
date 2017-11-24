/**
 * @namespace GLOBAL-STORAGE MODULE
 * @author Jordi Hereu <https://github.com/jhereu>
 * @description Node module for storing data which can be available between js files.
 * @version 1.0
 */

var _ = require('underscore');

var GLOBALS = {};

exports.set = function (key, val) {
    if (_.isObject(key) && !val) {
        GLOBALS = _.extend(GLOBALS, key);
        return;
    }
    GLOBALS[key] = val;
    return;
};

exports.get = function (key) {
    return GLOBALS[key];
};

exports.list = function () {
    return GLOBALS;
};

exports.flush = function () {
    GLOBALS = {};
    return;
};

exports.isSet = function (key) {
    return _.has(GLOBALS, key);
};

exports.unset = function (key) {
    GLOBALS = _.omit(GLOBALS, key);
    return;
};