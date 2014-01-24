$(function () {
    var indexViewModifier = new IndexViewModifier();
    indexViewModifier.startListening();

    var indexActionHandler = new IndexActionHandler();
    indexActionHandler.viewDidLoad();
});