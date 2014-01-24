/**
 * This class contains all the variable information of the view.
 * @constructor
 */
function ViewModel() {
    this.messageKey = 'message';
    this.menuKey = 'menu';
    this.serverApi = new ServerApi();
    this.storageApi = new StorageApi();

    $(document)
        .bind(Constants.events.receivedMessage, this.setMessage.bind(this))
        .bind(Constants.events.receivedContentData, this.setContent.bind(this))
        .bind(Constants.events.receivedMenuData, this.setMenu.bind(this));
}

/**
 * This method persists the menu content as JSON.
 * @param data
 */
ViewModel.prototype.setMenu = function (event, menu) {
    this.storageApi.set(this.menuKey, menu);
    $.event.trigger(Constants.events.updatedMenu);
};

/**
 * This method returns the menu.
 * @returns {*}
 */
ViewModel.prototype.getMenu = function () {
    var returnValue = this.storageApi.get(this.menuKey);

    if (!returnValue || returnValue === null)
        this.serverApi.getMenu();

    return returnValue;
};

/**
 * This method sets the main content.
 * @param data
 * @param key
 */
ViewModel.prototype.setContent = function (event, pageId, content) {
    this.storageApi.set(pageId, content);
    $.event.trigger(Constants.events.updatedContent);
};

/**
 * This method returns the main content.
 * @param url
 * @returns {*}
 */
ViewModel.prototype.getContent = function (url) {
    var returnValue = this.storageApi.get(url);

    if (!returnValue || returnValue === null)
        this.serverApi.getContent(url);

    return returnValue;
};

/**
 * This method sets the message value.
 * @param message
 */
ViewModel.prototype.setMessage = function (event, message) {
    this.storageApi.set(this.messageKey, message);
    $.event.trigger(Constants.events.updatedMessage);
};

/**
 * This method returns the message value.
 * @returns {*}
 */
ViewModel.prototype.getMessage = function () {
    return this.storageApi.get(this.messageKey);
};

/**
 * This method removes the message from the storage.
 */
ViewModel.prototype.removeMessage = function () {
    this.storageApi.remove(this.messageKey);
    $.event.trigger(Constants.events.updatedMessage);
};