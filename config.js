var Config = require('electron-config');

var instance;

function AppConfig() {
    var config = new Config();

    var path = '';

    if(typeof __dirname !== 'undefined') {
        path = __dirname;
    }

    var defaults = {
        showDockIcon : false,
        alwaysOnTop : true,
        showOnRightClick : false,
        preloadWindow : true,
        width : 400,
        height : 400,
        windowPosition : 'trayCenter',
        externalLinks : false,
        userAgent : 'Mozilla/5.0 (iPad; CPU OS 9_0 like Mac OS X) AppleWebKit/601.1.17 (KHTML, like Gecko) Version/8.0 Mobile/13A175 Safari/600.1.',
        globalShortcuts : true,
        icon : path + '/icons/logo-icon-black-and-white/icon.iconset/icon_16x16.png',
        iconPressed : path + '/icons/logo-icon-black-and-white-inverse/icon.iconset/icon_16x16.png'
    };

    if (typeof config.store === 'object') {
        if (Object.keys(config.store).length === 0) {
            config.set(defaults);
        }
    }

    this.config = config;

    Object.defineProperty(this, 'store', {
        get : function() {
            return Object.assign(defaults, config.store) || {};
        }
    })

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
