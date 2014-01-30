/**
 * This class contains all the actions (incl. bindings) triggered by view events and custom events.
 * @constructor
 */
function IndexActionHandler() {
    this.userModel = new UserModel();
    this.viewModel = new ViewModel();
}

/**
 * Do all the binding, showing and hiding.
 */
IndexActionHandler.prototype.viewDidLoad = function () {
    // Action bindings for UI element events
    $('body')
        .on('click', '#message-close-button', this.closePopupHandler.bind(this))
        .on('submit', '#frmLogin', this.loginHandler.bind(this))
        .on('click', 'a.menu-item:not(#logout)', this.menuItemClickHandler.bind(this))
        .on('click', 'a.menu-item#logout', this.logoutHandler.bind(this));

    // Apache Cordova initialization
    $(document).bind('mobileinit', function () {
        $.mobile.allowCrossDomainPages = true;
        $.mobile.buttonMarkup.hoverDelay = 0;
    });
};

/**
 * This method gets called when the OK-button in the popup was clicked
 */
IndexActionHandler.prototype.closePopupHandler = function (){
    this.viewModel.removeMessage();
};

/**
 * This method gets called when the login form is submitted.
 */
IndexActionHandler.prototype.loginHandler = function () {
    var email = $('#txtEmail').val();

    if(email !== ''){
        this.userModel.login(email);
    } else {
        this.viewModel.setMessage('Bitte füllen Sie das E-Mail-Feld aus.')
    }

    return false;
};

/**
 * This method gets called when the logout button was clicked.
 */
IndexActionHandler.prototype.logoutHandler = function () {
    this.userModel.logout();

    return false;
};

/**
 * This method gets called when a menu item was clicked
 */
IndexActionHandler.prototype.menuItemClickHandler = function (event) {
    var menuItem = $(event.currentTarget);
    this.viewModel.setLastRequestedView(menuItem.attr('href'), menuItem.attr('title'));

    return false;
};

