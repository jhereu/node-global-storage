/**
 * @name GLOBAL-STORAGE MODULE
 * @author Jordi Hereu <https://github.com/jhereu>
 * @description Node module for storing data that can be available between js files.
 * @version 1.1
 */

/* Dependencies */
var _ = require('underscore'); /* All-Mighty Underscore! */

var GLOBALS = {}; /* Where we're going to store all our data */

/**
 * @name set
 * @description Stores data (value) with a given name (key).
 * @param {String} key
 * @param {String|Integer|Object|Array} value
 * @returns {undefined}
 */
exports.set = function (key, value) {
    if (_.isObject(key) && !value) {
        GLOBALS = _.extend(GLOBALS, key);
        return;
    }
    GLOBALS[key] = value;
    return;
};

/**
 * @name get
 * @description Returns the value of the provided key name.
 * @param {String} key
 * @returns {String|Integer|Object|Array|Function|undefined}
 */
exports.get = function (key) {
    return !key ? null : _.reduce(key.split('.'), function (found, chunk) {
        return !found || !_.has(found, chunk) ? null : found[chunk];
    }, GLOBALS);
};

/**
 * @name list
 * @description Returns all stored data so far.
 * @returns {Object}
 */
exports.list = function () {
    return GLOBALS;
};

/**
 * @name flush
 * @description Deletes all stored data.
 * @returns {undefined}
 */
exports.flush = function () {
    GLOBALS = {};
    return;
};

/**
 * @name isSet
 * @description Checks if a key was stored with some data and returns a predicate.
 * @param {String|Integer} key
 * @returns {boolean}
 */
exports.isSet = function (key) {
    return _.has(GLOBALS, key);
};

/**
 * @name unset
 * @description Deletes the data stored with the given name (key).
 * @param {String|Integer} key
 * @returns {undefined}
 */
exports.unset = function (key) {
    GLOBALS = _.omit(GLOBALS, key);
    return;
};