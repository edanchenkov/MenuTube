var electron = require('electron');
var menubar = require('menubar');
var ipcMain = require('electron').ipcMain;

var AppConfig = require('./config.js');
var config = AppConfig.store.userPreferences;

var mb = menubar(
    Object.assign(AppConfig.store.defaults)
);

var accelerators = [
    'MediaNextTrack',
    'MediaPreviousTrack',
    'MediaStop',
    'MediaPlayPause',
    'Cmd+Alt+Y'
];

mb.on('ready', function ready() {
    console.info('Main process is ready, continue...');

    //*
    //  Hide from dock and finder
    // */
    if (!process.env.npm_config_debug) {
        mb.app.dock.hide();
    }

    var globalShortcut = electron.globalShortcut;

    var registerGlobalShortcuts = function () {
        var shortcutsHandler = function (accelerator) {
            mb.window.webContents.send('global-shortcut', { accelerator : accelerator });
        };

        for (var i = 0; i < accelerators.length; i++) {
            var a = accelerators[i];
            if (!globalShortcut.isRegistered(a)) {
                globalShortcut.register(a, shortcutsHandler.bind(globalShortcut, a));
            }
        }
    };

    var toggleWindow = function () {
        if (mb.window.isVisible()) {
            mb.hideWindow();
        } else {
            mb.showWindow();
        }
    };

    ipcMain.on('updatePreferences', function (e, config) {
        for (var key in config) {
            if(config.hasOwnProperty(key)) {
                mb.setOption(key, config[key]);
            }
        }

        if (!config.globalShortcuts) {
            globalShortcut.unregisterAll();
        } else {
            registerGlobalShortcuts();
        }

        AppConfig.update(config);
    });

    ipcMain.on('toggleWindow', function () {
        toggleWindow();
    });

    mb.tray.on('right-click', toggleWindow);
    registerGlobalShortcuts();

});

mb.on('after-create-window', function () {
    mb.window.setResizable(config.windowResize);
    mb.window.setMinimumSize(400, 400);
});

mb.on('after-show', function () {
    mb.tray.setImage(AppConfig.store.defaults.iconPressed);
});

mb.on('after-hide', function () {
    mb.tray.setImage(AppConfig.store.defaults.icon);
});
