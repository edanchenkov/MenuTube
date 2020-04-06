exports.continueInit = function (wv, controls) {

    console.info('Main process is initialised and seems to work');

    var AppConfig = require('./../config.js');
    var ipcRenderer = require('electron').ipcRenderer;

    var config = AppConfig.store;

    document.body.classList.add(config.userPreferences.theme);
    ipcRenderer.on('on-preference-change', function (e, data) {
        var classList = document.body.className.split(' ');
        for (var i = 0; i < classList.length; i++) {
            var className = classList[i];
            if (className && className.indexOf('-theme') >= 0) {
                document.body.classList.remove(className);
            }
        }
        document.body.classList.add(data.theme);
    });

    if (config.userPreferences.windowDraggable && typeof document.body !== 'undefined') {
        document.body.classList.add('draggable');
        setTimeout(function () {
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        }, 100);
    }

    if (config.userPreferences.PIPModeByDefault) {
        document.body.classList.add("PIP-mode");
    }

    if (typeof wv !== 'undefined' && typeof wv.loadURL === 'function') {
        var globalShortcuts = require('./globalShortcuts.js');
        var uiControls = require('./ui-controls.js');
        var urlHandler = require('./urlHandler.js');

        var options = { userAgent: config.defaults.userAgent };

        if (config.userPreferences.desktopMode) {
            options.userAgent = config.defaults.desktopUserAgent;
        }

        /* This all is not the best approach for handling loading state,
        *   but it is enough for now
        * */
        var ts = Date.now();
        var splashScreen = document.querySelector('.splash-screen');
        var hideSplashScreen = function () {
            splashScreen.classList.add('hide');
            setTimeout(function () {
                splashScreen.style.display = 'none';
                // Must be longer that hide transition, see index.html
            }, 600);
        };

        wv.addEventListener('dom-ready', function () {
            var diff = Date.now() - ts;
            if (diff > 1250) {
                hideSplashScreen();
            } else {
                hideSplashScreen();
            }

            /* DEBUG wvHelper */
            // wv.openDevTools();
        });

        wv.loadURL('https://www.youtube.com/', options).then(() => {
            urlHandler.init(wv);
            globalShortcuts.init(wv);
            uiControls.init(wv, controls);
        });
    } else {
        alert('Something went wrong, cannot create webview...');
    }
};
