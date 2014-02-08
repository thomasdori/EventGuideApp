/**
 * This class wraps the event handling and contains all the event names.
 * @constructor
 */
function EventHub() {
}

/**
 * This object contains all the event names used in the application.
 * @type {{
 * receivedLogoutData: string,
 * receivedLoginData: string,
 * receivedContentData: string,
 * receivedMenuData: string,
 * receivedMessage: string,
 * receivedOk: string,
 * requestInitiated: string,
 * requestDone: string,
 * updatedMenu: string,
 * updatedContent: string,
 * updatedMessage: string,
 * userLoggedOut: string,
 * userLoggedIn: string}}
 */
EventHub.prototype.events = {
    receivedLogoutData: 'receivedLogoutData',
    receivedLoginData: 'receivedLoginData',
    receivedContentData: 'receivedContentData',
    receivedMenuData: 'receivedMenuData',
    receivedMessage: 'receivedMessage',
    receivedOk: 'receivedOk',
    requestInitiated: 'requestInitiated',
    requestDone: 'requestDone',
    updatedMenu: 'updatedMenu',
    updatedContent: 'updatedContent',
    updatedMessage: 'updatedMessage',
    userLoggedOut: 'userLoggedOut',
    userLoggedIn: 'userLoggedIn'
};

/**
 * This method is used to subscribe to an event with a given name and a given callback.
 * @param eventName
 * @param callback
 */
EventHub.prototype.subscribe = function (eventName, callback) {
    $(document).bind(eventName, callback);
};

/**
 * This method is used to trigger an event with a given name and given parameters.
 * @param eventName
 * @param parameter
 */
EventHub.prototype.trigger = function (eventName, parameter) {
    $.event.trigger(eventName, parameter);
};