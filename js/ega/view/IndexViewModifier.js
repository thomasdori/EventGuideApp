/**
 * This class encapsulates all methods that modify the index.html view
 * @constructor
 */
function IndexViewModifier() {
    this.viewModel = new ViewModel();
    this.eventHub = new EventHub();
}

/**
 * This method binds the functions to the custom events
 */
IndexViewModifier.prototype.startListening = function () {
    this.eventHub.subscribe(this.eventHub.events.requestInitiated, this.showLoadingAnimation.bind(this));
    this.eventHub.subscribe(this.eventHub.events.requestDone, this.hideLoadingAnimation.bind(this));
    this.eventHub.subscribe(this.eventHub.events.updatedMenu, this.updateMenu.bind(this));
    this.eventHub.subscribe(this.eventHub.events.updatedContent, this.updateContent.bind(this));
    this.eventHub.subscribe(this.eventHub.events.updatedMessage, this.updateMessage.bind(this));
    this.eventHub.subscribe(this.eventHub.events.userLoggedOut, this.showLoginView.bind(this));
    this.eventHub.subscribe(this.eventHub.events.userLoggedIn, this.showAppView.bind(this));
};

/**
 * This method hides the login form and shows the app content.
 */
IndexViewModifier.prototype.showAppView = function () {
    $('#frmLogin').hide();
    $('#appContent').show();
    $('#menu-button').show();

    this.updateMenu();
};

/**
 * This method hides the app content and shows the login form.
 */
IndexViewModifier.prototype.showLoginView = function () {
    $('#pageTitle').html('');
    $('#nav-panel').panel('close');
    $('#appContent').hide();
    $('#menu-button').hide();
    $('#frmLogin').show();
    $('#txtEmail').val('').focus();
};

/**
 * This method creates the menu DOM from the given JSON data
 */
IndexViewModifier.prototype.updateMenu = function (event, data) {
    if(!data){
        data = this.viewModel.getMenu();
    }

    if (data) {
        this.loadAndApplyTemplate(data.templateFileName, data, '.nav-search');
    }
};

/**
 * This method updates the main content area.
 */
IndexViewModifier.prototype.updateContent = function (event, data) {
    if(!data){
        data = this.viewModel.getContent();
    }

    if (data) {
        //display the correct icon
        if (this.viewModel.getViewStackSize() > 0) {
            $('#menu-button').hide();
            $('#back-button').show();
        } else {
            $('#back-button').hide();
            $('#menu-button').show();
        }

        //set the page title and content
        $('#pageTitle').html(this.viewModel.getCurrentPageTitle());
        this.loadAndApplyTemplate(data.templateFileName, data.content, '#appContent');

        // close the menu so the main content is visible
        $('#nav-panel').panel('close');
    }
};

/**
 * This method shows a message with a given title.
 */
IndexViewModifier.prototype.updateMessage = function () {
    var message = this.viewModel.getMessage();

    //check if the cordova api is available
    if (navigator.notification.alert) {
        navigator.notification.alert(
            message,                // message
            function () {},         // callback
            'EGA',                  // title
            'OK'                    // buttonName
        );
    } else {
        window.alert(message);
    }
};

/**
 * This method makes the loading animation visible.
 */
IndexViewModifier.prototype.showLoadingAnimation = function () {
    $.mobile.loading('show', {textVisible: true, text: '', theme: 'b'});
};

/**
 * This method makes the loading animation invisible.
 */
IndexViewModifier.prototype.hideLoadingAnimation = function () {
    $.mobile.loading('hide');
};

/**
 * This method loads the template file via AJAX.
 * @param templateFileName
 * @param templateContent
 * @param templateContainer
 */
IndexViewModifier.prototype.loadAndApplyTemplate = function (templateFileName, templateContent, templateContainer) {
    $.get('templates/' + templateFileName + '.html', {}, function (templateStructure) {
        $(templateContainer).empty();
        $.tmpl(templateStructure, templateContent).appendTo(templateContainer);

        //just in case we loaded a list view or menu
        $('[data-role="listview"]').listview();
        $('.nav-search').listview('refresh');
    });
};