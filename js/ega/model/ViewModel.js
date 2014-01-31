/**
 * This class contains all the variable information of the view.
 * @constructor
 */
function ViewModel() {
    this.messageKey = 'message';
    this.menuKey = 'menu';
    this.currentViewKey = 'currentView';
    this.viewStackKey = 'viewStack';
    this.serverApi = new ServerApi();
    this.storageApi = new StorageWrapper();
    this.eventHub = new EventHub();

    this.eventHub.subscribe(this.eventHub.events.receivedMessage, this.setMessage.bind(this));
    this.eventHub.subscribe(this.eventHub.events.receivedContentData, this.setContent.bind(this));
    this.eventHub.subscribe(this.eventHub.events.receivedMenuData, this.setMenu.bind(this));
}

/**
 * This method persists the menu content as JSON.
 * @param event
 * @param menu
 */
ViewModel.prototype.setMenu = function (event, menu) {
    this.storageApi.set(this.menuKey, menu);
    this.eventHub.trigger(this.eventHub.events.updatedMenu);
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
 * @param event
 * @param content
 */
ViewModel.prototype.setContent = function (event, content) {
    var url = this.getCurrentPageUrl();
    
    if(url && url !== null){
        this.storageApi.set(url, content);
        this.eventHub.trigger(this.eventHub.events.updatedContent);
    }
};

/**
 * This method returns the main content.
 * @returns {*}
 */
ViewModel.prototype.getContent = function () {
    var url = this.getCurrentPageUrl(),
        returnValue;

    if(url && url !== null){
        returnValue = this.storageApi.get(url);

        if (!returnValue || returnValue === null)
            this.serverApi.getContent(url);
    }

    return returnValue;
};

/**
 * This method sets the message value.
 * @param message
 * @param event
 */
ViewModel.prototype.setMessage = function (event, message) {
    this.storageApi.set(this.messageKey, message);
    this.eventHub.trigger(this.eventHub.events.updatedMessage);
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
    this.eventHub.trigger(this.eventHub.events.updatedMessage);
};

/**
* This method returns the title of the currently requested page.
* @returns {*}
*/
ViewModel.prototype.getCurrentPageTitle = function(){
    return this.storageApi.get(this.currentViewKey).title;
};

/**
* * This method returns the url of the currently requested page.
* @returns {*}
*/
ViewModel.prototype.getCurrentPageUrl = function(){
    return this.storageApi.get(this.currentViewKey).url;
};

/**
 * This method gets the number of views on the view stack;
 * @returns {Number|number|c.length|*|length}
 */
ViewModel.prototype.getViewStackSize = function(){
    var viewStack = this.storageApi.get(this.viewStackKey);
    return (viewStack && viewStack != null) ? viewStack.length : 0;
};

/**
 * This method sets the url and title of the currently requested page.
 * @param url
 * @param title
 */
ViewModel.prototype.showView = function (url, title){
    if(url && title){
        var currentView = {
                "url": url,
                "title": title
            };

        this.storageApi.set(this.currentViewKey, currentView);
        this.eventHub.trigger(this.eventHub.events.updatedContent);
    }
};

/**
 * This method sets the url and title of the currently requested page.
 * @param url
 * @param title
 */
ViewModel.prototype.pushView = function (url, title){
    if(url && title){
        var previousView = {
            "url": this.getCurrentPageUrl(),
            "title": this.getCurrentPageTitle()
            },

            currentView = {
                "url": url,
                "title": title
            };

        //add the view to the view stack
        var viewStack = this.storageApi.get(this.viewStackKey);
        viewStack = viewStack ? viewStack : [];
        viewStack.push(previousView);
        this.storageApi.set(this.viewStackKey, viewStack);

        this.storageApi.set(this.currentViewKey, currentView);
        this.eventHub.trigger(this.eventHub.events.updatedContent);
    }
};

/**
 * This method pops the last previous view from the view stack and updates the model.
 */
ViewModel.prototype.popView = function(){
    var viewStack = this.storageApi.get(this.viewStackKey),
        previousView;

    viewStack = viewStack ? viewStack : [];
    previousView = viewStack.pop();
    this.storageApi.set(this.currentViewKey, previousView);
    this.storageApi.set(this.viewStackKey, viewStack);
    this.eventHub.trigger(this.eventHub.events.updatedContent);
};


