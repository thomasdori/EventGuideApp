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
//        .on('click', 'li.session', this.sessionClickHandler.bind(this))
//        .on('click', 'li.speaker', this.speakerClickHandler.bind(this))
//        .on('click', '.details-speaker', this.speakerDetailClickHandler.bind(this))
//        .on('click', '#iconbutton.ui-icon-bars', this.menuButtonHandler.bind(this))
//        .on('click', '#iconbutton.ui-icon-arrow-l', this.backButtonHandler.bind(this))
//        .on('submit', '#frmComment', this.commentSubmitHandler.bind(this))
//        .on('click', '#btnSubmitPoll', this.pollSubmitHandler.bind(this))
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
 * @returns {boolean}
 */
IndexActionHandler.prototype.loginHandler = function () {
    var email = $('#txtEmail').val();

    if(email !== ''){
        this.userModel.login(email);
    } else {
        this.viewModel.setMessage('Bitte füllen Sie das E-Mail-Feld aus.')
    }

    // prevent default behaviour of html form
    return false;
};

/**
 * This method gets called when the logout button was clicked.
 */
IndexActionHandler.prototype.logoutHandler = function () {
    this.userModel.logout();

    // prevent default behaviour of html anchor
    return false;
};

/**
 * This method gets called when a menu item was clicked
 * @returns {boolean}
 */
IndexActionHandler.prototype.menuItemClickHandler = function (event) {
    var menuItem = $(event.target);

    $('#pageTitle').html(menuItem.attr('title'));

    this.viewModel.getContent(menuItem.attr('href'));

    // prevent default behaviour of html anchor
    return false;
};

/**
 * This method gets called when a session was clicked.
 */
//IndexActionHandler.prototype.sessionClickHandler = function () {
////    var sessionItem = $(this);
////    this.viewHelper.loadDetailView(templateFileDetailName, sessionItem);
//};

/**
 * This method gets called when a speaker was clicked.
 */
//IndexActionHandler.prototype.speakerClickHandler = function () {
////    var speakerItem = $(this);
////    this.viewHelper.loadDetailView(templateFileDetailName, speakerItem);
//};

/**
 * This method gets called when a speaker's detail link was clicked.
 */
//IndexActionHandler.prototype.speakerDetailClickHandler = function () {
////    this.serverApi.getSpeakerById($(this).attr('data-speaker-id'), this.callbackHandler.gotSpeaker.bind(this.callbackHandler));
//};

///**
// * Disable the submit button so it can not be re-submitted.
// */
//IndexActionHandler.prototype.disablePollSubmit = function(){
//    var submitButton = $('#btnSubmitPoll');
//    submitButton.prop('disabled', true);
//    submitButton.parent().removeClass();
//    submitButton.parent().addClass('button-disabled');
//};

/**
 // * This method gets called when the menu button was clicked.
 // */
//IndexActionHandler.prototype.menuButtonHandler = function () {
//    //this.viewHelper.showMenuIcon();
//
//    //this.viewHelper.loadDetailView(backSpeakerContent[0], backSpeakerContent[1]);
//};

///**
// * This method gets called when the backbutton was clicked.
// */
//IndexActionHandler.prototype.backButtonHandler = function () {
////    var title = this.viewModel.lastView.children('span.menu-item-title').html(),
////        url = this.viewModel.lastView.attr('href'),
////        menuType = this.viewModel.lastView.attr('data-menu-item-type');
//
////    this.viewHelper.loadContent(title, url, menuType);
//};


///**
// * This method is called when a comment was submitted.
// * @returns {boolean}
// */
//IndexActionHandler.prototype.commentSubmitHandler = function () {
//    var textAreaContent = $('#comment_textarea').val();
//
//    if (textAreaContent) {
//        //this.serverApi.submitComment(textAreaContent, $(this).attr('data-postid-toSubmit'), this.userModel.getLoggedInUser(), this.callbackHandler.commentSubmitted.bind(this.callbackHandler));
//    } else {
//        this.viewModel.setMessage('Kommentarfeld darf nicht leer sein.');
//    }
//
//    // prevent default behaviour of html form
//    return false;
//};
//
///**
// * Submits a filled out poll.
// * @returns {boolean}
// */
//IndexActionHandler.prototype.pollSubmitHandler = function () {
//    var checkedElementValue = $('input[type="radio"]:checked').val();
//
//    if (!$(this).is(':disabled')) {
//        if (checkedElementValue) {
//            //this.serverApi.submitPollVote($(this).attr('data-poll-id'), checkedElementValue, $('#new-answer-text').val(), this.callbackHandler.pollVoteSubmitted.bind(this.callbackHandler));
//        } else {
//            this.viewModel.setMessage('Bitte wählen Sie zuerst eine Antwort aus.');
//        }
//    } else {
//        this.viewModel.setMessage('Sie haben für diese Umfrage bereits abgestimmt.');
//    }
//
//    // prevent default behaviour of html form
//    return false;
//};
