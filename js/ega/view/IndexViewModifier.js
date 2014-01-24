/**
 * This class encapsulates all methods that modify the view in index.html
 * @constructor
 */
function IndexViewModifier() {
    this.barsIconClass = 'ui-icon-bars';
    this.arrowIconClass = 'ui-icon-arrow-l';
    this.bindActionHandler();
    this.viewModel = new ViewModel();
}

/**
 * This method binds the functions to the custom events
 */
IndexViewModifier.prototype.bindActionHandler = function(){
    $(document)
        .bind(Constants.events.requestInitiated, this.showLoadingAnimation.bind(this))
        .bind(Constants.events.requestDone, this.hideLoadingAnimation.bind(this))
        .bind(Constants.events.requestFailed, this.showConnectionError.bind(this))
        .bind(Constants.events.updatedMenu, this.updateMenu.bind(this))
        .bind(Constants.events.updatedMainContent, this.updateMainContent.bind(this))
        .bind(Constants.events.updatedMessage, this.updateMessage.bind(this))
        .bind(Constants.events.userLoggedOut, this.showLoginView.bind(this))
        .bind(Constants.events.userLoggedIn, this.showAppView.bind(this));
};

/**
 * Changes the menu icon.
 */
IndexViewModifier.prototype.showMenuIcon = function () {
    this.switchMenuIcons(this.barsIconClass, this.arrowIconClass);
};

/**
 * Shows the back icon.
 */
IndexViewModifier.prototype.showBackIcon = function () {
    this.switchMenuIcons(this.arrowIconClass, this.barsIconClass);
};

/**
 * Hide the login form and show the app content.
 */
IndexViewModifier.prototype.showAppView = function () {
    this.updateMenu();
    this.updateMainContent();

    $('#iconbutton').show();
    $('#frmLogin').hide();
    $('#appContent').show();
};

/**
 * Hide the app content form and show the login form.
 */
IndexViewModifier.prototype.showLoginView = function () {
    $('#pageTitle').html('');
    $('#nav-panel').panel('close');
    $('#appContent').hide();
    $('#iconbutton').hide();
    $('#frmLogin').show();
    $('#txtEmail').val('').focus();
};

/**
 * This method creates the menu DOM from the given JSON data
 */
IndexViewModifier.prototype.updateMenu = function(){
    var templateContent = this.viewModel.getMenu();

    if (templateContent){
        this.loadAndApplyTemplate('menu', templateContent, '.nav-search');
    }
};

/**
 *
 * @param data
 */
IndexViewModifier.prototype.updateMainContent = function(){
    var mainContent = this.viewModel.getMainContent();

    if(mainContent){}
//
//    var templateFileName,
//        templateContent;
//
//    if (data.posts) {
//        templateFileName = 'posts';
//        templateContent = data;
//    } else if (data.page) {
//        templateFileName = 'page';
//        templateContent = data.page;
//    } else if (data.templateFile && data.templateContent) {
//        templateFileName = data.templateFile;
//        templateContent = data.templateContent;
//    } else {
//        return;
//    }
//
//    // load the template file via AJAX
//    this.loadAndApplyTemplate(templateFileName, templateContent, '#appContent');

    // close the menu so the main content is visible
    $('#nav-panel').panel('close');
};

/**
 * This method opens a pop-up that shows a message about a connection error.
 */
IndexViewModifier.prototype.showConnectionError = function () {
    this.viewModel.setMessage('Es ist ein Fehler in der Kommunikation mit dem Server aufgetreten.');
};

/**
 * This method shows a message with a given title.
 */
IndexViewModifier.prototype.updateMessage = function () {
    var message = this.viewModel.getMessage(),
        popupElement = $('#popup-message');

    if(message && message !== ''){
        $('#message-title').html('Event Guide App');
        $('#message-content').html(message);

        popupElement.popup();
        popupElement.popup("open");
    } else {
        popupElement.popup("close");
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
 * Switches between menu and back icon.
 * @param oldIconName
 * @param newIconName
 */
IndexViewModifier.prototype.switchMenuIcons = function (oldIconName, newIconName) {
    $('#iconbutton').attr('data-icon', oldIconName).find('.ui-icon')
        .removeClass(oldIconName)
        .addClass(newIconName);
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

            //just in case we loaded a list view
            $('[data-role="listview"]').listview();
            $('#session-list').listview().listview('refresh');
            $('.nav-search').listview('refresh');
            $('#news').trigger('click');
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