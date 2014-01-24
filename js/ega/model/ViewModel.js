/**
 * This class contains all the variable information of the view.
 * @constructor
 */
function ViewModel(){
    this.messageKey = 'message';
    this.mainContentKey = 'mainContent';
    this.menuKey = 'menu';
    this.serverApi = new ServerApi();
    this.storageApi = new StorageApi();
}

ViewModel.prototype.lastViewUrl = '';

/**
 * This method persists the menu content as JSON.
 * @param data
 */
ViewModel.prototype.setMenu = function(data) {
    this.storageApi.set(this.menuKey, data);
    jQuery.event.trigger(Constants.events.updatedMenu, [data]);
};

/**
 * This method returns the menu.
 * @returns {*}
 */
ViewModel.prototype.getMenu = function(){
    var returnValue = this.storageApi.get(this.menuKey);

    if(!returnValue || returnValue === null)
        this.serverApi.getMenu(this.menuCallback.bind(this));

    return returnValue;
};

/**
 * This method sets the main content.
 * @param data
 */
ViewModel.prototype.setContent = function(data) {
    this.storageApi.set(this.mainContentKey, data);
    jQuery.event.trigger(Constants.events.updatedContent);
};

/**
 * This method returns the main content.
 * @param url
 * @returns {*}
 */
ViewModel.prototype.getContent = function(url){
    var returnValue = this.storageApi.get(url);

    if(!returnValue || returnValue === null)
        this.serverApi.getContent(url, this.contentCallback.bind(this));

    return returnValue;
};

/**
 * This method sets the message value.
 * @param message
 */
ViewModel.prototype.setMessage = function(message){
    this.storageApi.set(this.messageKey, message);
    jQuery.event.trigger(Constants.events.updatedMessage);
};

/**
 * This method returns the message value.
 * @returns {*}
 */
ViewModel.prototype.getMessage = function(){
    return this.storageApi.get(this.messageKey);
};

/**
 * This method removes the message from the storage.
 */
ViewModel.prototype.removeMessage = function() {
    this.storageApi.remove(this.messageKey);
    jQuery.event.trigger(Constants.events.updatedMessage);
}

/**
 * Handles menu callback.
 * @param data - The data returned form the server.
 */
ViewModel.prototype.menuCallback = function (data) {
    this.setMenu(data)
};

/**
 * Handles site callback.
 * @param data - The data returned form the server.
 */
ViewModel.prototype.contentCallback = function (data) {
    this.setContent(data)
};