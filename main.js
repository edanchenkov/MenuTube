var electron = require('electron');
var menubar = require('menubar');

var options = {
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
    windowPosition : 'trayCenter'
};

var mb = menubar(options);

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

    mb.tray.on('right-click', function () {
        if (mb.window.isVisible()) {
            mb.hideWindow();
        } else {
            mb.showWindow();
        }
    });
});

mb.on('after-create-window', function () {
    mb.window.setResizable(false);
});
