var Config = require('electron-config');

var instance,
    path = '';

if (typeof __dirname !== 'undefined') {
    path = __dirname;
}

/*
 * Configs that should be saved locally must be listed here
 * */
var userPreferences = {
    alwaysOnTop : true,
    windowPosition : 'trayCenter',
    userAgent : 'Mozilla/5.0 (iPad; CPU OS 9_0 like Mac OS X) AppleWebKit/601.1.17 (KHTML, like Gecko) Version/8.0 Mobile/13A175 Safari/600.1.',
    globalShortcuts : true
};

var defaults = {
    showOnRightClick : false,
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
