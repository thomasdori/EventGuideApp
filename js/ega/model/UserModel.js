/**
 * This class manages all user relevant data.
 * @constructor
 */
function UserModel() {
    this.userIsLoggedInKey = 'isLoggedIn';
    this.userKey = 'user';
    this.storageApi = new StorageApi();
    this.serverApi = new ServerApi();

    $.event.trigger(this.isLoggedIn() ? Constants.events.userLoggedIn : Constants.events.userLoggedOut);

    $(document)
        .bind(Constants.events.receivedLogoutData, this.removeUser.bind(this))
        .bind(Constants.events.receivedLoginData, this.setUser.bind(this));
}

/**
 * This method returns TRUE if the user is logged in and FALSE if not.
 * @returns {*}
 */
UserModel.prototype.isLoggedIn = function () {
    return this.storageApi.get(this.userIsLoggedInKey);
};

/**
 * This method returns the email address of the loggedin user
 * @returns {*}
 */
UserModel.prototype.getLoggedInUser = function () {
    return this.storageApi.get(this.userKey);
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
 */
UserModel.prototype.setUser = function(event, user){
    jQuery.event.trigger(Constants.events.userLoggedIn);
    this.storageApi.set(this.userIsLoggedInKey, 'true');
    this.storageApi.set(this.userKey, user.content);
};

/**
 * This method removes the user from the storage.
 */
UserModel.prototype.removeUser = function(){
    jQuery.event.trigger(Constants.events.userLoggedOut);
    this.storageApi.clear();
};