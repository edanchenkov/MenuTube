var electron = require('electron');
var menubar = require('menubar');
var ipcMain = require('electron').ipcMain;

var AppConfig = require('./config.js');

var mb = menubar(AppConfig.store);

var accelerators = [
    'MediaNextTrack',
    'MediaPreviousTrack',
    'MediaStop',
    'MediaPlayPause'
];

mb.on('ready', function ready() {
    console.info('Main process is ready, continue...');

    var globalShortcut = electron.globalShortcut;

    var shortcutsHandler = function (accelerator) {
        mb.window.webContents.send('global-shortcut', { accelerator : accelerator });
    };

    for (var i = 0; i < accelerators.length; i++) {
        var a = accelerators[i];
        globalShortcut.register(a, shortcutsHandler.bind(globalShortcut, a));
    }

    var hideWindow = function () {
        if (mb.window.isVisible()) {
            mb.hideWindow();
        } else {
            mb.showWindow();
        }
    };

    mb.tray.on('right-click', hideWindow);

    ipcMain.on('updatePreferences', function (e, config) {
        for (var key in config) {
            mb.setOption(key, config[key]);
        }

        AppConfig.update(config);
    });

    ipcMain.on('hideAndPause', function () {
        hideWindow();
    });

});

mb.on('after-create-window', function () {
    mb.window.setResizable(false);
});
