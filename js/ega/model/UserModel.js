/**
 * This class manages all user relevant data.
 * @constructor
 */
function UserModel() {
    this.userIsLoggedInKey = 'isLoggedIn';
    this.userKey = 'user';
    this.storageApi = new StorageWrapper();
    this.serverApi = new ServerApi();
    this.eventHub = new EventHub();

    this.eventHub.trigger(this.isLoggedIn() ? this.eventHub.events.userLoggedIn : this.eventHub.events.userLoggedOut);
    this.eventHub.subscribe(this.eventHub.events.receivedLogoutData, this.removeUser.bind(this));
    this.eventHub.subscribe(this.eventHub.events.receivedLoginData, this.setUser.bind(this));
}

/**
 * This method returns TRUE if the user is logged in and FALSE if not.
 * @returns {*}
 */
UserModel.prototype.isLoggedIn = function () {
    return this.storageApi.get(this.userIsLoggedInKey);
};

/**
 * This method sends a login request to the server
 * @param email
 */
UserModel.prototype.login = function (email) {
    if(!this.isLoggedIn()){
        this.serverApi.login(email);
    }
};

/**
 * This method sends a logout request to the server
 */
UserModel.prototype.logout = function () {
    if(this.isLoggedIn()){
        this.serverApi.logout();
    }
};

/**
 * This method sets the user variable in the storage
 * @param user
 * @param event
 */
UserModel.prototype.setUser = function(event, user){
    this.eventHub.trigger(this.eventHub.events.userLoggedIn);
    this.storageApi.set(this.userIsLoggedInKey, 'true');
    this.storageApi.set(this.userKey, user.content);
};

/**
 * This method removes the user from the storage.
 */
UserModel.prototype.removeUser = function(){
    this.eventHub.trigger(this.eventHub.events.userLoggedOut);
    this.storageApi.clear();
};