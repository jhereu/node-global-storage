/**
 * @name node-global-storage
 * @url https://www.npmjs.com/package/node-global-storage
 * @author Jordi Hereu <hello@jordiher.eu> (http://github.com/jhereu)
 * @description Global scope variable managing and storing data making it accessible in multiple Javascript files.
 * @version 1.2
 */

/* Dependencies */
var _ = require('underscore'); /* All-Mighty Underscore! */

/* Where we're going to store all our data */
var DATA = {};

/* Global default options */
var OPTIONS = {
    verbose: false,
    protected: false,
    force: false,
    silent: false,
    onUpdate: false,
    onDelete: false
};

/**
 * @name default
 * @description Override default behavioural option for all transactions without specific options.
 * @param {String} key
 * @param {Boolean} value
 * @returns {undefined}
 */
exports.default = function (key, value) {
    OPTIONS[key] = value;
    OPTIONS.verbose && console.log("node-global-storage :: %s :: Global option set successfully.", key);
    return;
};

/**
 * @name set
 * @description Stores data (value) with a given name (key).
 * @param {String} key
 * @param {String|Integer|Object|Array|Function} value
 * @param {Object} options (Optional) Defines specific options for the transaction.
 * @returns {String|Integer|Object|Array|Function}
 */
exports.set = function (key, value, options) {
    var exists = _.has(DATA, key);
    var protected = _.has(DATA[key], 'protected') ? DATA[key].protected : OPTIONS.protected;
    var forced = _.has(options, 'force') ? options.force : OPTIONS.force;
    var silent = _.has(options, 'silent') ? options.silent : OPTIONS.silent;
    var onUpdate = exists && _.isFunction(DATA[key].onUpdate) ? DATA[key].onUpdate : OPTIONS.onUpdate;

    if (exists && protected && !forced) {
        OPTIONS.verbose && console.log("node-global-storage :: %s :: Key already exists and it's protected. Try {force: true} next time.", key);
        return;
    }
    DATA[key] = _.extend({value: value}, _.defaults(_.pick(options, _.keys(OPTIONS)), OPTIONS));
    OPTIONS.verbose && console.log('node-global-storage :: %s :: Key sucessfully stored.', key);
    return _.isFunction(onUpdate) && !silent ? onUpdate(key, value) : value;
};

/**
 * @name get
 * @description Returns the value of the provided key name.
 * @param {String} key
 * @returns {String|Integer|Object|Array|Function|undefined}
 */
exports.get = function (key) {
    var exists = _.has(DATA, key);
    if (!exists) {
        OPTIONS.verbose && console.log("node-global-storage :: %s :: Key doesn't exist.", key);
        return;
    }
    OPTIONS.verbose && console.log("node-global-storage :: %s :: Key retrieved successfully.", key);
    return DATA[key].value;
};

/**
 * @name list
 * @description Returns all stored data so far.
 * @param {Boolean} listProperties - If true, returns also specific options for the given key.
 * @returns {Object}
 */
exports.list = function (listProperties) {
    OPTIONS.verbose && console.log("node-global-storage :: Keys listed successfully.");
    return listProperties ? DATA : _.reduce(DATA, function (out, val, key) {
        out[key] = val.value;
        return out;
    }, {});
};

/**
 * @name flush
 * @description Deletes all stored data.
 * @param {Object} options - Defines specific options for the transaction.
 * @returns {undefined}
 */
exports.flush = function (options) {
    var forced = _.has(options, 'force') ? options.force : OPTIONS.force;
    if (forced) {
        DATA = {};
        OPTIONS.verbose && console.log("node-global-storage :: All keys deleted successfully.");
        return;
    }
    DATA = _.reduce(DATA, function (out, value, key) {
        var deleteCallback = value.onDelete || OPTIONS.onDelete;
        if (value.protected) {
            out[key] = value;
        } else if (_.isFunction(deleteCallback)) {
            deleteCallback(key, value.value);
        }
        return out;
    }, {});
    OPTIONS.verbose && console.log("node-global-storage :: Non-protected keys deleted successfully.");
    return;
};

/**
 * @name isSet
 * @description Checks if a key was stored with some data.
 * @param {String|Integer} key
 * @returns {Boolean}
 */
exports.isSet = function (key) {
    OPTIONS.verbose && console.log("node-global-storage :: %s :: Key existance checked successfully.", key);
    return _.has(DATA, key);
};

/**
 * @name isProtected
 * @description Checks if a key was stored with protection.
 * @param {String|Integer} key
 * @returns {Boolean}
 */
exports.isProtected = function (key) {
    var exists = _.has(DATA, key);
    if (!exists) {
        OPTIONS.verbose && console.log("node-global-storage :: %s :: Key does not exist.", key);
        return false;
    }
    OPTIONS.verbose && console.log("node-global-storage :: %s :: Key's protection checked successfully.", key);
    return DATA[key].protected;
};

/**
 * @name unset
 * @description Deletes the data stored with the given name (key).
 * @param {String|Integer} key
 * @param {Object} options - Defines specific options for the transaction.
 * @returns {undefined}
 */
exports.unset = function (key, options) {
    var exists = _.has(DATA, key);
    var forced = _.has(options, 'force') ? options.force : OPTIONS.force;
    var protected = _.has(DATA, key) && DATA[key].protected;
    var silent = _.has(options, 'silent') ? options.silent : OPTIONS.silent;
    var deleteCallback = exists && _.isFunction(DATA[key].onDelete) ? DATA[key].onDelete : OPTIONS.onDelete;

    if (exists && (forced || !protected)) {
        _.omit(DATA, key);
        var value = DATA[key].value;
        OPTIONS.verbose && console.log("node-global-storage :: %s :: Key deleted successfully.", key);
        return _.isFunction(deleteCallback) && !silent ? deleteCallback(key, value) : value;
    }
    OPTIONS.verbose && console.log("node-global-storage :: %s :: Couldn't delete key. Try {force: true} next time.", key);
    return;
};