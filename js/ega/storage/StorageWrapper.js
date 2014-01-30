/**
 * This class is in response of handling the storage. Either session- or cookie storage.
 * @constructor
 */
function StorageWrapper() {}

/**
 * This property is either the sessionStorage or a cookie storage.
 * @type {Storage}
 */
StorageWrapper.prototype.storage = (sessionStorage) ? sessionStorage : cookieStorage;

/**
 * This method gets the object that corresponds to the given key.
 * @param key
 * @returns {*}
 */
StorageWrapper.prototype.get = function (key) {
    var returnValue = this.storage.getItem(key);

    return JSON.parse(returnValue);
};

/**
 * This method adds the given object with the given key to the storage.
 * @param key
 * @param object
 */
StorageWrapper.prototype.set = function (key, object) {
    this.storage.setItem(key, JSON.stringify(object))
};

/**
 * This method removes the one object with the given key.
 * @param key
 */
StorageWrapper.prototype.remove = function (key) {
    this.storage.removeItem(key);
};

/**
 * This method removes everything from the storage.
 */
StorageWrapper.prototype.clear = function () {
    this.storage.clear();
};