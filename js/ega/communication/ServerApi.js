/**
 * This class provides all methods to request data from the server
 * @constructor
 */
function ServerApi() {
    this.callBackHandler = new CallBackHandler();
    this.eventHub = new EventHub();
}

/**
 * This is the only method that does a jquery ajax request to a remote resource.
 * @param method
 * @param data
 * @param callback
 */
ServerApi.prototype.getJSON = function (method, data, callback) {
    var url = 'http://localhost/EventGuideService/api/' + method + '/';

    this.eventHub.trigger(this.eventHub.events.requestInitiated, {});
    $.support.cors = true;

    $.getJSON(url, data, callback)
        .fail(this.callBackHandler.requestFailed.bind(this.callBackHandler))
        .always(this.callBackHandler.requestDone.bind(this.callBackHandler));
};

/**
 * This method is used to get content provided by the backend.
 * @param url
 */
ServerApi.prototype.getContent = function (url) {
    this.getJSON(url, {}, this.callBackHandler.contentCallback.bind(this.callBackHandler));
};

/**
 * This method prepares and sends a menu request to the server.
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

/**
 * This methods sends the comment for a session to the server.
 * @param userId
 * @param sessionId
 * @param comment
 */
ServerApi.prototype.sendComment = function (userId, sessionId, comment) {
    var data = {'user_id': userId, 'session_id': sessionId, 'comment': comment};
    this.getJSON('respond.submit_comment', data, this.callBackHandler.submissionCallbackHandler.bind(this.callBackHandler));
};

/**
 * This methods sends the poll vote for a session.
 * @param userId
 * @param pollId
 * @param selectedValue
 */
ServerApi.prototype.sendPollVote = function (userId, pollId, selectedValue) {
    var data = {'user_id': userId, 'poll_id': pollId, 'selectedValue': selectedValue};
    this.getJSON('polls.vote_poll', data, this.callBackHandler.submissionCallbackHandler.bind(this.callBackHandler));
};