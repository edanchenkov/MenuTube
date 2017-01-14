var Config = require('electron-config');

var instance;

function AppConfig() {
    var config = new Config();

    var defaults = {
        showDockIcon : true,
        alwaysOnTop : true,
        showOnRightClick : false,
        preloadWindow : true,
        // y : 25,
        // x : 400,
        width : 400,
        height : 400,
        // windowPosition : 'trayLeft'
        // windowPosition : 'trayRight',
        windowPosition : 'trayCenter',
        externalLinks : false
    };

    if (typeof config.store === 'object') {
        if (Object.keys(config.store).length === 0) {
            config.set(defaults);
        }
    }

    this.store = Object.assign(defaults, config.store) || {};
    this.config = config;
}

AppConfig.prototype = {
    update : function (config) {
        this.config.set(config);
    }
};

var getInstance = function() {
    instance = instance || new AppConfig();
    return instance;
};

module.exports = getInstance();
