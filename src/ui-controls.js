var remote = require('electron').remote;
var Menu = remote.Menu;
var MenuItem = remote.MenuItem;
var BrowserWindow = remote.BrowserWindow;
var app = remote.app;
var shell = remote.shell;
var ipcRenderer = require('electron').ipcRenderer;

var urlHandler = require('./urlHandler.js');
var wv = window.wv;

var clickHandler = function (name, menu) {
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

var dynamicLabel = 'Check for Updates';

var defaultMenuItems = [
    {
        label : 'Open in browser',
        click : function () {
            hideAndPause();
            shell.openExternal(urlHandler.getCurrentURL());
        },
        role : 'help'
    },
    {
        type : 'separator'
    },
    {
        label : 'Video controls',
        click : function () {
            var win = new BrowserWindow({
                // width : 800,
                // height : 600,
                frame : true
            });

            hideAndPause();

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

            hideAndPause();
            var path = app.getAppPath();
            win.loadURL('file://' + path + '/views/preferences.html');
            win.show()
        },
        role : 'help'
    },
    {
        label : dynamicLabel,
        click : function () {
            hideAndPause();
            shell.openExternal('https://edanchenkov.github.io/MenuTube/');
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

var hideAndPause = function () {
    ipcRenderer.send('toggleWindow');
    wv.send('pause');
};

var buildMenu = function (menu, menuItems) {

    menu.clear();

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
};


/*
 *   This should not be here, but lets make it simple for now
 *   TODO: Time outs and retries should be handled where this function is called, not within the function
 * */
var attempts = 5;
var checkForUpdate = function (menu, controls) {
    if (attempts > 0) {
        attempts--;
        setTimeout(function () {
            fetch('https://api.github.com/repos/edanchenkov/MenuTube/releases/latest').then(function (res) {
                res.json().then(function (data) {
                    if (typeof data !== 'undefined' && data.hasOwnProperty('tag_name')) {


                        if (data.tag_name !== remote.app.getVersion()) {
                            var menuItems = defaultMenuItems.map(function (mi) {
                                /*
                                 *   Should check against something else probably, not label
                                 * */
                                if (mi.label === dynamicLabel) {
                                    mi.label = '(!) New version is available';
                                }
                                return mi;
                            });

                            var prefIcon = controls.preferenceButton.querySelector('i.fa');

                            prefIcon.classList.remove('fa-bars');
                            prefIcon.classList.add('fa-exclamation-circle', 'update-available');

                            buildMenu(menu, menuItems);
                        }
                    }
                });
            }, checkForUpdate.bind(this, menu));
        }, 2000);
    }
};


exports.init = function (wv, controls) {
    var menu = new Menu();
    buildMenu(menu, defaultMenuItems);
    checkForUpdate(menu, controls);

    for (var c in controls) {
        if (controls.hasOwnProperty(c)) {
            var el = controls[c];
            if (el && typeof el.addEventListener === 'function') {
                el.addEventListener('click', clickHandler.bind(el, c, menu), false);
            }
        }
    }
};
