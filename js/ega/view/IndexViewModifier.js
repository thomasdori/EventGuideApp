/**
 * This class encapsulates all methods that modify the view in index.html
 * @constructor
 */
function IndexViewModifier() {
//    this.barsIconClass = 'ui-icon-bars';
//    this.arrowIconClass = 'ui-icon-arrow-l';
    this.viewModel = new ViewModel();
}

/**
 * This method binds the functions to the custom events
 */
IndexViewModifier.prototype.startListening = function(){
    $(document)
        .bind(Constants.events.requestInitiated, this.showLoadingAnimation.bind(this))
        .bind(Constants.events.requestDone, this.hideLoadingAnimation.bind(this))
        .bind(Constants.events.updatedMenu, this.updateMenu.bind(this))
        .bind(Constants.events.updatedContent, this.updateContent.bind(this))
        .bind(Constants.events.updatedMessage, this.updateMessage.bind(this))
        .bind(Constants.events.userLoggedOut, this.showLoginView.bind(this))
        .bind(Constants.events.userLoggedIn, this.showAppView.bind(this));
};

/**
 * Hide the login form and show the app content.
 */
IndexViewModifier.prototype.showAppView = function () {
    this.updateMenu();

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
 */
IndexViewModifier.prototype.updateContent = function(){
    var data = this.viewModel.getContent();

    if(data){
        $('#pageTitle').html(this.viewModel.getCurrentPageTitle());
        this.loadAndApplyTemplate(data.template, data.content, '#appContent');

        // close the menu so the main content is visible
        $('#nav-panel').panel('close');
    }
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