var electron = require('electron');
var menubar = require('menubar');

var options = {
    showDockIcon : true,
    alwaysOnTop : true,
    showOnRightClick : false
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
});

mb.on('after-create-window', function () {
    mb.window.setResizable(false);
});
