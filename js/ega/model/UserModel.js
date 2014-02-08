/**
 * This class manages all user relevant data.
 * @constructor
 */
function UserModel() {
    this.userIsLoggedInKey = 'isLoggedIn';
    this.userKey = 'user';
    this.storageWrapper = new StorageWrapper();
    this.serverApi = new ServerApi();
    this.eventHub = new EventHub();

    this.eventHub.trigger(this.isLoggedIn() ? this.eventHub.events.userLoggedIn : this.eventHub.events.userLoggedOut, {});
    this.eventHub.subscribe(this.eventHub.events.receivedLogoutData, this.removeUser.bind(this));
    this.eventHub.subscribe(this.eventHub.events.receivedLoginData, this.setUser.bind(this));
}

/**
 * This method returns TRUE if the user is logged in and FALSE if not.
 * @returns {*}
 */
UserModel.prototype.isLoggedIn = function () {
    return this.storageWrapper.get(this.userIsLoggedInKey);
};

/**
 * This method uses the serverApi to send a login request to the server.
 * @param email
 */
UserModel.prototype.login = function (email) {
    if (!this.isLoggedIn()) {
        this.serverApi.login(email);
    }
};

/**
 * This method uses the serverApi to send a logout request to the server.
 */
UserModel.prototype.logout = function () {
    if (this.isLoggedIn()) {
        this.serverApi.logout();
    }
};

/**
 * This method sets the user variable in the storage.
 * @param user
 * @param event
 */
UserModel.prototype.setUser = function (event, user) {
    this.eventHub.trigger(this.eventHub.events.userLoggedIn, {});
    this.storageWrapper.set(this.userIsLoggedInKey, 'true');
    this.storageWrapper.set(this.userKey, user.content);
};

/**
 * This method gets the user's email address from the storage and returns it.
 * @returns {*}
 */
UserModel.prototype.getUser = function () {
    return this.storageWrapper.get(this.userKey);
};

/**
 * This method removes the user data from the storage.
 */
UserModel.prototype.removeUser = function () {
    this.eventHub.trigger(this.eventHub.events.userLoggedOut, {});
    this.storageWrapper.clear();
};