/**
 * This class manages all user relevant data.
 * @constructor
 */
function UserModel() {
    this.userIsLoggedInKey = 'isLoggedIn';
    this.userKey = 'user';
    this.storageApi = new StorageApi();
    this.serverApi = new ServerApi();
    this.viewModel = new ViewModel();

    jQuery.event.trigger(this.isLoggedIn() ? Constants.events.userLoggedIn : Constants.events.userLoggedOut);
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
        this.serverApi.login(email, this.loginCallback.bind(this));
    }
};

/**
 * This method sends a logout request to the server
 */
UserModel.prototype.logout = function () {
    if(this.isLoggedIn()){
        this.serverApi.logout(this.logoutCallback.bind(this));
    }
};

/**
 * This method sets the user variable in the storage
 * @param user
 */
UserModel.prototype.setUser = function(user){
    jQuery.event.trigger(Constants.events.userLoggedIn);
    this.storageApi.set(this.userIsLoggedInKey, 'true');
    this.storageApi.set(this.userKey, user);
};

/**
 * This method removes the user from the storage.
 */
UserModel.prototype.removeUser = function(){
    jQuery.event.trigger(Constants.events.userLoggedOut);
    this.storageApi.clear();
};

/**
* Handles login callback.
* @param data - The data returned form the server.
*/
UserModel.prototype.loginCallback = function (data) {
    if (data.status && data.status === 'ok' && data.user) {
        this.setUser(data.user);
    } else {
        this.viewModel.setMessage('Diese E-Mail Adresse wurde noch nicht registriert.');
    }
};

/**
* Handles logout callback.
* @param data - The data returned form the server.
*/
UserModel.prototype.logoutCallback = function (data) {
    if (data.status && data.status === 'ok') {
        this.removeUser();
    } else {
        this.viewModel.setMessage('Beim Logout trat ein Fehler auf.');
    }
};