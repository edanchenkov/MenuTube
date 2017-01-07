exports.init = function (wv, controls) {
    var clickHandler = function (name, e) {
        switch (name) {
            case ('backButton'):
                if (wv.canGoBack()) {
                    wv.goBack();
                }
                break;
            case ('refreshButton'):
                wv.reload();
                break;
            case ('forwardButton'):
                if (wv.canGoForward) {
                    wv.goForward();
                }
                break;
            case ('preferenceButton'):
                break;
        }
    };

    for (var c in controls) {
        var el = controls[c];
        if (el && typeof el.addEventListener === 'function') {
            el.addEventListener('click', clickHandler.bind(el, c), false);
        }
    }
};
