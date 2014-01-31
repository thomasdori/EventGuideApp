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
        .on('click', '#back-button', this.backButtonHandler.bind(this))
        .on('click', 'a.menu-item#logout', this.logoutHandler.bind(this))
        .on('click', 'a.menu-item:not(#logout)', this.itemClickHandler.bind(this))
        .on('click', 'a.speaker-item', this.detailItemClickHandler.bind(this))
        .on('click', 'a.list-view-item', this.detailItemClickHandler.bind(this));

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
 * This method gets called when a menu item, speaker link or list item was clicked.
 */
IndexActionHandler.prototype.itemClickHandler = function (event) {
    var item = $(event.currentTarget);
    this.viewModel.showView(item.attr('href'), item.attr('title'));

    return false;
};

/**
 * This method gets called when a menu item, speaker link or list item was clicked.
 */
IndexActionHandler.prototype.detailItemClickHandler = function (event) {
    var item = $(event.currentTarget);
    this.viewModel.pushView(item.attr('href'), item.attr('title'));

    return false;
};

/**
 * This method gets called when a menu item, speaker link or list item was clicked.
 */
IndexActionHandler.prototype.backButtonHandler = function (event) {
    this.viewModel.popView();

    return false;
};