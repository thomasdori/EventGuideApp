/**
 * This class encapsulates all methods that modify the view in index.html
 * @constructor
 */
function IndexViewModifier() {
    this.viewModel = new ViewModel();
    this.eventHub = new EventHub();
}

/**
 * This method binds the functions to the custom events
 */
IndexViewModifier.prototype.startListening = function(){
    this.eventHub.subscribe(this.eventHub.events.requestInitiated, this.showLoadingAnimation.bind(this));
    this.eventHub.subscribe(this.eventHub.events.requestDone, this.hideLoadingAnimation.bind(this));
    this.eventHub.subscribe(this.eventHub.events.updatedMenu, this.updateMenu.bind(this));
    this.eventHub.subscribe(this.eventHub.events.updatedContent, this.updateContent.bind(this));
    this.eventHub.subscribe(this.eventHub.events.updatedMessage, this.updateMessage.bind(this));
    this.eventHub.subscribe(this.eventHub.events.userLoggedOut, this.showLoginView.bind(this));
    this.eventHub.subscribe(this.eventHub.events.userLoggedIn, this.showAppView.bind(this));
};

/**
 * Hide the login form and show the app content.
 */
IndexViewModifier.prototype.showAppView = function () {
    $('#frmLogin').hide();
    $('#appContent').show();
    $('#menu-button').show();

    this.updateMenu();
};

/**
 * Hide the app content form and show the login form.
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
IndexViewModifier.prototype.updateMenu = function(){
    var data = this.viewModel.getMenu();

    if (data){
        this.loadAndApplyTemplate(data.templateFileName, data, '.nav-search');
    }
};

/**
 *
 */
IndexViewModifier.prototype.updateContent = function(){
    var data = this.viewModel.getContent();

    if(data){
        //display the correct icon
        if(this.viewModel.getViewStackSize() > 0){
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

    if(navigator.notification.alert){
        navigator.notification.alert(
            message,                // message
            function(){},           // callback
            'EGA',                  // title
            'OK'                  // buttonName
        );
    } else {
        window.alert(message);
    }
};

/**
 * This method makes the loading animation visible.
 */
IndexViewModifier.prototype.showLoadingAnimation = function () {
    //showing an empty text is necessary so the spinning animation is darker
    $.mobile.loading('show', {textVisible: true, text: '', theme: 'b'});
};

/**
 * This method makes the loading animation invisible
 */
IndexViewModifier.prototype.hideLoadingAnimation = function () {
    $.mobile.loading('hide');
};

/**
 * This method loads the template file via AJAX.
 * @param templateName
 * @param templateContent
 * @param templateContainer
 */
IndexViewModifier.prototype.loadAndApplyTemplate = function(templateName, templateContent, templateContainer) {
    $.get(this.getTemplatePath(templateName), {},  function(templateStructure){
            $(templateContainer).empty();
            $.tmpl(templateStructure, templateContent).appendTo(templateContainer);

            //just in case we loaded a list view or menu
            $('[data-role="listview"]').listview();
            $('.nav-search').listview('refresh');
    });
};

/**
 * This method creates the path to a given template
 * @param templateFileName
 * @returns {string}
 */
IndexViewModifier.prototype.getTemplatePath = function(templateFileName){
    return 'templates/' + templateFileName + '.html';
};