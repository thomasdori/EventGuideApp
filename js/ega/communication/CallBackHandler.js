/**
 * This class contains all the methods that handle server callbacks.
 * @constructor
 */
function CallBackHandler(){
    this.eventHub = new EventHub();
}

/**
 * This method gets called if a request failed.
 */
CallBackHandler.prototype.requestFailed = function(){
    this.eventHub.trigger(this.eventHub.events.receivedMessage, 'Es ist ein Fehler in der Kommunikation mit dem Server aufgetreten.');
};

/**
 * This method gets called after every request.
 */
CallBackHandler.prototype.requestDone = function(){
    this.eventHub.trigger(this.eventHub.events.requestDone);
};

/**
 * Handles login callback.
 * @param data - The data returned form the server.
 */
CallBackHandler.prototype.loginCallback = function (data) {
    this.validateServerData(data, this.eventHub.events.receivedLoginData, 'Diese E-Mail Adresse wurde noch nicht registriert.');
};

/**
 * Handles logout callback.
 * @param data - The data returned form the server.
 */
CallBackHandler.prototype.logoutCallback = function (data) {
    this.validateServerData(data, this.eventHub.events.receivedLogoutData, 'Beim Logout trat ein Fehler auf.');
};

/**
 * This message handles the callback for the menu request.
 * @param data
 */
CallBackHandler.prototype.menuCallback = function (data) {
    this.validateServerData(data, this.eventHub.events.receivedMenuData, 'Bein Laden des Menüs trat ein Fehler auf.');
};

/**
 * This message handles the callback for the content request.
 * @param data
 */
CallBackHandler.prototype.contentCallback = function (data) {
    this.validateServerData(data, this.eventHub.events.receivedContentData, 'Bein Laden der Inhalte trat ein Fehler auf.');
};

/**
 * This message validates the data returned from the server and check if it contains an error message.
 * @param data
 * @param successCallbackEventName
 * @param errorMessage
 */
CallBackHandler.prototype.validateServerData = function (data, successCallbackEventName, errorMessage) {
    if (!data.error && data.content) {
        var argument = {content: data.content, templateFileName: data.templateFileName};
        this.eventHub.trigger(successCallbackEventName, argument);
    } else {
        this.eventHub.trigger(this.eventHub.events.receivedMessage, errorMessage)
    }
};
