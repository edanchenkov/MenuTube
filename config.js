var Config = require('electron-config');

var instance;

function AppConfig() {
    var config = new Config();

    var defaults = {
        showDockIcon : true,
        alwaysOnTop : true,
        showOnRightClick : false,
        preloadWindow : true,
        width : 400,
        height : 400,
        windowPosition : 'trayCenter',
        externalLinks : false,
        userAgent : 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        globalShortcuts : true
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

var getInstance = function () {
    instance = instance || new AppConfig();
    return instance;
};

module.exports = getInstance();
