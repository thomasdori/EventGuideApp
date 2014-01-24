/**
 * This class is in response of handling the storageApi.
 * @constructor
 */
function StorageApi() {}

/**
 * This property is either the sessionStorage or a cookie storage.
 * @type {Storage}
 */
StorageApi.prototype.storage = (sessionStorage) ? sessionStorage : docCookies;

/**
 * This method gets the object that corresponds to the given key.
 * @param key
 * @returns {*}
 */
StorageApi.prototype.get = function (key) {
    var returnValue = this.storage.getItem(key);

    return JSON.parse(returnValue);
};

/**
 * This method adds the given object with the given key to the storage.
 * @param key
 * @param object
 */
StorageApi.prototype.set = function (key, object) {
    this.storage.setItem(key, JSON.stringify(object))
};

/**
 * This method removes the one object with the given key.
 * @param key
 */
StorageApi.prototype.remove = function (key) {
    this.storage.removeItem(key);
};

/**
 * This method removes everything from the storage.
 */
StorageApi.prototype.clear = function () {
    this.storage.clear();
};