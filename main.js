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

var defaultMenu = [
    {
        label : 'Edit',
        submenu : [
            {
                label : 'Undo',
                accelerator : 'CmdOrCtrl+Z',
                role : 'undo'
            },
            {
                label : 'Redo',
                accelerator : 'Shift+CmdOrCtrl+Z',
                role : 'redo'
            },
            {
                type : 'separator'
            },
            {
                label : 'Cut',
                accelerator : 'CmdOrCtrl+X',
                role : 'cut'
            },
            {
                label : 'Copy',
                accelerator : 'CmdOrCtrl+C',
                role : 'copy'
            },
            {
                label : 'Paste',
                accelerator : 'CmdOrCtrl+V',
                role : 'paste'
            },
            {
                label : 'Select All',
                accelerator : 'CmdOrCtrl+A',
                role : 'selectall'
            }
        ]
    },
    {
        label : 'View',
        submenu : [
            {
                label : 'Reload',
                accelerator : 'CmdOrCtrl+R',
                click : function (item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.reload();
                }
            },
            {
                label : 'Toggle Developer Tools',
                accelerator : (function () {
                    if (process.platform === 'darwin')
                        return 'Alt+Command+I';
                    else
                        return 'Ctrl+Shift+I';
                })(),
                click : function (item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.toggleDevTools();
                }
            },
            {
                label : 'Quit',
                accelerator : 'Command+Q',
                click : function () {
                    mb && mb.app && mb.app.quit();
                }
            }
        ]
    }
];


mb.on('ready', function ready() {
    console.info('Main process is ready, continue...');
    console.info('Debug:', !!process.env.npm_config_debug);

    /*
     *   Set app menu to be able to use copy and paste shortcuts
     * */
    var Menu = electron.Menu;
    Menu.setApplicationMenu(Menu.buildFromTemplate(defaultMenu));

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
            if (config.hasOwnProperty(key)) {
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

    if (config.globalShortcuts) {
        registerGlobalShortcuts();
    }

});

var bounds;

mb.on('after-create-window', function () {
    mb.window.setResizable(config.windowResize);
    mb.window.setMinimumSize(400, 400);

});

mb.on('after-show', function () {
    /* Skip first show */
    if (typeof bounds !== "undefined") {
        mb.window.setBounds(bounds);
    }
    if (config.highlightTray) {
        mb.tray.setImage(AppConfig.store.defaults.iconPressed);
    } else {
        mb.tray.setHighlightMode('never');
    }
});

mb.on('after-hide', function () {
    bounds = mb.window.getBounds();
    mb.tray.setImage(AppConfig.store.defaults.icon);
});
