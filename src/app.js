exports.continueInit = function (wv, controls) {

    console.info('Main process is initialised and seems to works');

    var AppConfig = require('./../config.js');

    if (typeof wv !== 'undefined' && typeof wv.loadURL === 'function') {
        var globalShortcuts = require('./globalShortcuts.js');
        var uiControls = require('./ui-controls.js');
        var urlHandler = require('./urlHandler.js');

        var options = { userAgent : AppConfig.store.userAgent };

        wv.loadURL('https://www.youtube.com/', options);

        urlHandler.init(wv);
        globalShortcuts.init(wv);
        uiControls.init(wv, controls);
    } else {
        alert('Something went wrong, cannot create webview...');
    }
};
