function EventHub(){}

EventHub.prototype.events = {
    receivedLogoutData: 'receivedLogoutData',
    receivedLoginData: 'receivedLoginData',
    receivedContentData: 'receivedContentData',
    receivedMenuData: 'receivedMenuData',
    receivedMessage: 'receivedMessage',
    requestInitiated: 'requestInitiated',
    requestDone: 'requestDone',
    updatedMenu: 'updatedMenu',
    updatedContent: 'updatedContent',
    updatedMessage: 'updatedMessage',
    userLoggedOut: 'userLoggedOut',
    userLoggedIn: 'userLoggedIn'
};

EventHub.prototype.subscribe = function(eventName, callback){
    $(document).bind(eventName, callback);
};

EventHub.prototype.trigger = function(eventName, parameter) {
    $.event.trigger(eventName, parameter);
};