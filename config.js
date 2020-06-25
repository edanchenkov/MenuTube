var Config = require('electron-config');

var instance,
    path = '';

if (typeof __dirname !== 'undefined') {
    path = __dirname;
}



// PATH TO CONFIG:
// /Users/<name>/Library/Application\ Support/MenuTube/

/*
 * Configs that should be saved locally must be listed here,
 * also settings that user can implicitly change
 * NOT VALID ANYMORE - NO LOCAL SETTINGS NO PREFERENCES PAGE!
 * */
var userPreferences = {
    adBlock: false,

    alwaysOnTop : true,
    windowResize : true,
    windowDraggable : true,
    windowPosition : 'trayCenter',
    globalShortcuts : true,
    PIPModeByDefault : false,
    highlightTray : true,
    rememberBounds : true,
    theme : 'red-theme',
    desktopMode : false,
};

var defaults = {
    showOnRightClick: false,
    userAgent: 'MMozilla/5.0 (Linux; Android 9; SM-G960F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36',
    desktopUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
    externalLinks: false,
    icon: path + '/icons/logo-icon-black-and-white/icon.iconset/icon_16x16.png',
    iconPressed: path + '/icons/logo-icon-black-and-white-inverse/icon.iconset/icon_16x16.png',
    preloadWindow: true,
    showDockIcon: false,
    browserWindow: {
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    },
};


function AppConfig() {
    var config = new Config();

    if (typeof config.store === 'object') {
        /*
         *  Ignore all local configs from now on
         * */
        // This is another hack
        userPreferences.adBlock = config.store.adBlock;

        config.set(Object.assign(userPreferences, {}));
    }


    this.config = config;

    Object.defineProperty(this, 'store', {
        get: function () {
            // Small hack to avoid issues with versioning and changes to preferences page
            defaults.browserWindow.alwaysOnTop = userPreferences.alwaysOnTop;
            return {
                all: Object.assign(defaults, userPreferences),
                userPreferences: userPreferences,
                defaults: defaults
            }
        }
    });

}

AppConfig.prototype = {
    update: function (config) {
        // This is another hack
        this.config.set(config);
    }
};

var getInstance = function () {
    instance = instance || new AppConfig();
    return instance;
};

module.exports = getInstance();
