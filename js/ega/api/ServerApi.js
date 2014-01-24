/**
 * This class provides all methods to request data from the server
 * @constructor
 */
function ServerApi() {
    this.callBackHandler = new CallBackHandler();
}

/**
 * This is the only method that does an jquery ajax request.
 * @param method
 * @param data
 * @param callback
 */
ServerApi.prototype.getJSON = function (method, data, callback) {
    var url = Constants.serverUrl + 'EventGuideService/api/' + method;

    $.event.trigger(Constants.events.requestInitiated);
    $.support.cors = true;

    $.getJSON(url, data, callback)
        .fail(this.callBackHandler.requestFailed.bind(this.callBackHandler))
        .always(this.callBackHandler.requestDone.bind(this.callBackHandler));
};

/**
 * This method is used to get default content provided by the backend.
 * @param site
 */
ServerApi.prototype.getContent = function (site) {
    this.getJSON(Constants.serverUrl + site, {}, this.callBackHandler.contentCallback.bind(this.callBackHandler));
};

/**
 * This method request the menu.
 */
ServerApi.prototype.getMenu = function () {
    this.getJSON('menus/get_menu', {}, this.callBackHandler.menuCallback.bind(this.callBackHandler));
};

/**
 * This method prepares and sends a login request to the server.
 * @param email
 */
ServerApi.prototype.login = function (email) {
    this.getJSON('authentication/login', {'email': email}, this.callBackHandler.loginCallback.bind(this.callBackHandler));
};

/**
 * This method prepares and sends a logout request to the server.
 */
ServerApi.prototype.logout = function () {
    this.getJSON('authentication/logout', {}, this.callBackHandler.logoutCallback.bind(this.callBackHandler));
};