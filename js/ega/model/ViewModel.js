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
    this.storageWrapper = new StorageWrapper();
    this.eventHub = new EventHub();

    this.eventHub.subscribe(this.eventHub.events.receivedMessage, this.setMessage.bind(this));
    this.eventHub.subscribe(this.eventHub.events.receivedContentData, this.setContent.bind(this));
    this.eventHub.subscribe(this.eventHub.events.receivedMenuData, this.setMenu.bind(this));
    this.eventHub.subscribe(this.eventHub.events.receivedLogoutData, this.loggedOut.bind(this));
}

/**
 * This method persists the menu content as JSON.
 * @param event
 * @param menu
 */
ViewModel.prototype.setMenu = function (event, menu) {
    var localMenu = this.storageWrapper.get(this.menuKey);

    // check if the menu was updated
    if(JSON.stringify(menu) !== JSON.stringify(localMenu)){
        this.storageWrapper.set(this.menuKey, menu);
        this.eventHub.trigger(this.eventHub.events.updatedMenu, menu);
    }
};

/**
 * This method returns the menu.
 * @returns {*}
 */
ViewModel.prototype.getMenu = function () {
    var returnValue = this.storageWrapper.get(this.menuKey);

    // send a request anyway, maybe an update is available
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

    if (url && url !== null) {
        var localContent = this.storageWrapper.get(url);

        // check if the content was updated
        if(JSON.stringify(localContent) !== JSON.stringify(content)){
            this.storageWrapper.set(url, content);
            this.eventHub.trigger(this.eventHub.events.updatedContent, content);
        }
    }
};

/**
 * This method returns the main content.
 * @returns {*}
 */
ViewModel.prototype.getContent = function () {
    var url = this.getCurrentPageUrl(),
        returnValue;

    if (url && url !== null) {
        returnValue = this.storageWrapper.get(url);

        // send a request anyway, maybe an update is available
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
    this.storageWrapper.set(this.messageKey, message);
    this.eventHub.trigger(this.eventHub.events.updatedMessage, {});
};

/**
 * This method returns the message value.
 * @returns {*}
 */
ViewModel.prototype.getMessage = function () {
    var returnValue = this.storageWrapper.get(this.messageKey);
    this.storeWrapper.remove(this.messageKey);

    return returnValue;
};

/**
 * This method returns the title of the currently requested page.
 * @returns {*}
 */
ViewModel.prototype.getCurrentPageTitle = function () {
    return this.storageWrapper.get(this.currentViewKey).title;
};

/**
 * * This method returns the url of the currently requested page.
 * @returns {*}
 */
ViewModel.prototype.getCurrentPageUrl = function () {
    return this.storageWrapper.get(this.currentViewKey).url;
};

/**
 * This method gets the number of views on the view stack.
 * @returns {Number|number|c.length|*|length}
 */
ViewModel.prototype.getViewStackSize = function () {
    var viewStack = this.storageWrapper.get(this.viewStackKey);
    return (viewStack && viewStack != null) ? viewStack.length : 0;
};

/**
 * This method sets the url and title of the currently requested page.
 * @param url
 * @param title
 */
ViewModel.prototype.showView = function (url, title) {
    if (url && title) {
        var currentView = {
            "url": url,
            "title": title
        };

        this.storageWrapper.set(this.currentViewKey, currentView);
        this.eventHub.trigger(this.eventHub.events.updatedContent, undefined);
    }
};

/**
 * This method sets the url and title of the currently requested page.
 * @param url
 * @param title
 */
ViewModel.prototype.pushView = function (url, title) {
    if (url && title) {
        var previousView = {
                "url": this.getCurrentPageUrl(),
                "title": this.getCurrentPageTitle()
            },

            currentView = {
                "url": url,
                "title": title
            };

        //add the view to the view stack
        var viewStack = this.storageWrapper.get(this.viewStackKey);
        viewStack = viewStack ? viewStack : [];
        viewStack.push(previousView);
        this.storageWrapper.set(this.viewStackKey, viewStack);

        this.storageWrapper.set(this.currentViewKey, currentView);
        this.eventHub.trigger(this.eventHub.events.updatedContent, undefined);
    }
};

/**
 * This method pops the last previous view from the view stack and updates the model.
 */
ViewModel.prototype.popView = function () {
    var viewStack = this.storageWrapper.get(this.viewStackKey),
        previousView;

    viewStack = viewStack ? viewStack : [];
    previousView = viewStack.pop();
    this.storageWrapper.set(this.currentViewKey, previousView);
    this.storageWrapper.set(this.viewStackKey, viewStack);
    this.eventHub.trigger(this.eventHub.events.updatedContent, undefined);
};

/**
 * This method uses the serverApi to send the given comment to the server.
 * @param userId
 * @param sessionId
 * @param comment
 */
ViewModel.prototype.setComment = function (userId, sessionId, comment) {
    this.serverApi.sendComment(userId, sessionId, comment);
};

/**
 * This method uses the serverApi to send the poll data to the server.
 * @param userId
 * @param pollId
 * @param data
 */
ViewModel.prototype.setPollVote = function (userId, pollId, data) {
    this.serverApi.sendPollVote(userId, pollId, data);
};

/**
 * This method sets a success message after a successful logout.
 */
ViewModel.prototype.loggedOut = function () {
    this.setMessage({}, 'Sie wurden erfolgreich ausgeloggt.');
};