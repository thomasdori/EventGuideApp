/**
 * This class provides all methods to request data from the server
 * @constructor
 */
function ServerApi() {}

/**
 * This is the only method that does an jquery ajax request.
 * @param method
 * @param data
 * @param callback
 */
ServerApi.prototype.getJSON = function (method, data, callback) {
    var url = Constants.serverUrl + 'EventGuideService/api/' + method;

    jQuery.event.trigger(Constants.events.requestInitiated);

    $.support.cors = true;

    $.getJSON(url, data, callback)
        .fail(function () {jQuery.event.trigger(Constants.events.requestFailed)})
        .always(function () {jQuery.event.trigger(Constants.events.requestDone)});
};

/**
* This method is used to get default content provided by the backend.
* @param site
* @param callback
*/
ServerApi.prototype.getSite = function (site, callback) {
    this.getJSON(Constants.serverUrl + site + '&json=1', {}, callback);
};

/**
 * This method prepares and sends a login request to the server.
 * @param email
 * @param callback
 */
ServerApi.prototype.login = function (email, callback) {
    this.getJSON('authentication/login', {
        'email': email
    }, callback);
};

/**
 * This method prepares and sends a logout request to the server.
 * @param callback
 */
ServerApi.prototype.logout = function (callback) {
    this.getJSON('authentication/logout', {}, callback);
};

/**
 * This method submits a comment made by the user.
 * @param commentContent
 * @param postId
 * @param user
 * @param callback
 */
ServerApi.prototype.submitComment = function (commentContent, postId, user, callback) {
    this.getJSON('respond/submit_comment', {
        'post_id': postId,
        'name': user,
        'email': user,
        'content': commentContent
    }, callback);
};

/**
 * This method submits a poll vote made by the user.
 * @param pollqId
 * @param pollaId
 * @param pollAnswerNew
 * @param callback
 */
ServerApi.prototype.submitPollVote = function (pollqId, pollaId, pollAnswerNew, callback) {
    this.getJSON('polls/vote_poll', {
        'pollq_id': pollqId,
        'polla_id': pollaId,
        'pollAnswerNew': pollAnswerNew
    }, callback);
};

/**
 * This method requests a specific poll.
 * @param pollId
 * @param callback
 */
ServerApi.prototype.getPollById = function (pollId, callback) {
    this.getJSON('polls/get_poll_for_session', {
        'pollid': pollId
    }, callback);
};

/**
 * This method requests a specific speaker.
 * @param speakerId
 * @param callback
 */
ServerApi.prototype.getSpeakerById = function (speakerId, callback) {
    this.getJSON('users/get_speakers', {
        'speakerid': speakerId
    }, callback);
};

/**
 * This method request the menu.
 * @param callback
 */
ServerApi.prototype.getMenu = function (callback) {
    this.getJSON('menus/get_menu', {}, callback);
};