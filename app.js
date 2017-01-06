var electron = require('electron');
var menubar = require('menubar');

var options = {
  showDockIcon: true,
  alwaysOnTop: true,
  showOnRightClick: false
};

var mb = menubar(options)

mb.on('ready', function ready() {
  console.log('app is ready', mb)
  var Menu = electron.Menu;
  var MenuItem = electron.MenuItem;
  var BrowserWindow = electron.BrowserWindow;

  menu = new Menu();
  menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))

  // Menu.setApplicationMenu(menu)



  // mb.window.loadUrl('https://youtube.com')

  // mb.window.addEventListener('contextmenu', (e) => {
  //   e.preventDefault()
  //   menu.popup(remote.getCurrentWindow())
  // }, false)

  // your app code here
});

mb.on('after-create-window', function () {
  // mb.window.openDevTools()
  var options = {
    // userAgent: 'Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev> (KHTML, like Gecko) Chrome/<Chrome Rev> Mobile Safari/<WebKit Rev>'
    userAgent: 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36'
};
  mb.window.loadURL('https://m.youtube.com', options)
});
