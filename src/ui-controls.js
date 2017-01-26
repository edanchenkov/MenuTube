exports.init = function (wv, controls) {

    var remote = require('electron').remote;
    var Menu = remote.Menu;
    var MenuItem = remote.MenuItem;
    var BrowserWindow = remote.BrowserWindow;
    var app = remote.app;
    var shell = remote.shell;
    var ipcRenderer = require('electron').ipcRenderer;

    var urlHandler = require('./urlHandler.js');

    var menu = new Menu();

    var menuItems = [
        {
            label : 'Open in browser',
            click : function () {
                ipcRenderer.send('hideAndPause');
                shell.openExternal(urlHandler.getCurrentURL());
            },
            role : 'help'
        },
        {
            type : 'separator'
        },
        // {
        //     label : 'Video controls',
        //     role : 'help',
        //     submenu: [
        //         {
        //             label: 'Play and Pause (>||)',
        //             enabled : false
        //         },
        //         {
        //             label: 'Go 5 seconds forward (>>)',
        //             enabled : false
        //         },
        //         {
        //             label: 'Go 5 seconds backward (<<)',
        //             enabled : false
        //         }
        //     ]
        // },
        {
            label : 'Video controls',
            click : function () {
                var win = new BrowserWindow({
                    // width : 800,
                    // height : 600,
                    frame : true
                });

                ipcRenderer.send('hideAndPause');

                var path = app.getAppPath();
                win.loadURL('file://' + path + '/views/preferences.html#media-keys');
                win.show()
            },
            role : 'help'
        },
        {
            label : 'Preferences',
            click : function () {
                var win = new BrowserWindow({
                    // width : 800,
                    // height : 600,
                    frame : true
                });

                ipcRenderer.send('hideAndPause');

                var path = app.getAppPath();
                win.loadURL('file://' + path + '/views/preferences.html');
                win.show()
            },
            role : 'help'
        },
        {
            label : 'Check for Updates',
            click : function () {
                ipcRenderer.send('hideAndPause');
                shell.openExternal('https://github.com/edanchenkov/MenuTube/releases');
            },
            role : 'help'
        },
        {
            type : 'separator'
        },
        {
            label : 'Reload',
            click : function () {
                if (typeof window !== 'undefined' &&
                    typeof window.location !== 'undefined' &&
                    typeof window.location.reload == 'function') {
                    window.location.reload();
                }
            },
            role : 'help',
            accelerator : 'Cmd+R'
        },
        {
            label : 'Quit',
            click : function () {
                app.quit();
            },
            role : 'help',
            accelerator : 'Cmd+Q'
        }
    ];

    for (var i = 0; i < menuItems.length; i++) {
        var mi = menuItems[i];
        menu.append(new MenuItem(
            {
                label : mi.label,
                click : mi.click,
                type : mi.type,
                role : mi.role,
                accelerator : mi.accelerator,
                submenu : mi.submenu
            })
        );
    }

    var clickHandler = function (name, e) {
        switch (name) {
            case ('backButton'):
                if (wv.canGoBack()) {
                    wv.goBack();
                }
                break;
            case ('refreshButton'):
                wv.reload();
                break;
            case ('forwardButton'):
                if (wv.canGoForward) {
                    wv.goForward();
                }
                break;
            case ('preferenceButton'):
                menu.popup(remote.getCurrentWindow());
                break;
        }
    };

    for (var c in controls) {
        var el = controls[c];
        if (el && typeof el.addEventListener === 'function') {
            el.addEventListener('click', clickHandler.bind(el, c), false);
        }
    }
}
;
