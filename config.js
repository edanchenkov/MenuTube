var Config = require('electron-config');

var instance,
    path = '';

if (typeof __dirname !== 'undefined') {
    path = __dirname;
}

/*
 * Configs that should be saved locally must be listed here,
 * also default values
 * */
var userPreferences = {
    alwaysOnTop : true,
    windowResize : true,
    windowDraggable : true,
    windowPosition : 'trayCenter',
    globalShortcuts : true,
    PIPModeByDefault : false,
    highlightTray : true,
    rememberBounds : true,
    bounds: undefined,
    theme: 'red-theme'
    // bounds : { x : 0, y : 0, width : 400, height : 400 }
};

var defaults = {
    showOnRightClick : false,
    userAgent : 'Mozilla/5.0 (Linux; U; Android 4.2; en-us; Nexus 10 Build/JVP15I) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
    externalLinks : false,
    icon : path + '/icons/logo-icon-black-and-white/icon.iconset/icon_16x16.png',
    iconPressed : path + '/icons/logo-icon-black-and-white-inverse/icon.iconset/icon_16x16.png',
    width : 400,
    height : 400,
    preloadWindow : true,
    showDockIcon : false
};


function AppConfig() {
    var config = new Config();

    if (typeof config.store === 'object') {

        if (Object.keys(config.store).length !== Object.keys(userPreferences).length) {
            for (var key in config.store) {
                if (config.has(key)) {
                    if (!userPreferences.hasOwnProperty(key)) {
                        config.delete(key);
                    }
                }
            }
        }

        /*
         *   Save config file locally into config.json
         * */
        config.set(Object.assign(userPreferences, config.store));
    }


    this.config = config;

    Object.defineProperty(this, 'store', {
        get : function () {
            return {
                all : Object.assign(defaults, config.store),
                userPreferences : config.store,
                defaults : defaults
            }
        }
    });

}

AppConfig.prototype = {
    update : function (config) {
        this.config.set(config);
    }
};

var getInstance = function () {
    instance = instance || new AppConfig();
    return instance;
};

module.exports = getInstance();
