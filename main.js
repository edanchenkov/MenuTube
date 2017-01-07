var electron = require('electron');
var menubar = require('menubar');

var options = {
  showDockIcon: true,
  alwaysOnTop: true,
  showOnRightClick: false
};

var mb = menubar(options);

var accelerators = [
  'MediaNextTrack',
  'MediaPreviousTrack',
  'MediaStop',
  'MediaPlayPause'
];

mb.on('ready', function ready() {
  // console.log('app is ready', mb)
  var Menu = electron.Menu;
  var MenuItem = electron.MenuItem;
  var BrowserWindow = electron.BrowserWindow;

  // var win = new BrowserWindow({width: 800, height: 600, frame: false})

  var globalShortcut = electron.globalShortcut;

  globalShortcut.register('MediaNextTrack', function () {
    // console.log('IS PRESSED', mb.window)
    // mb.window.getAllWebContents()
  });
});

mb.on('after-create-window', function () {
  mb.window.setResizable(false);

  // var webContents = electron.webContents;

  // console.log(webContents.getFocusedWebContents())

  // webContents.on('will-navigate', function () {
  //   console.log('arguments')
  //   var el = document.querySelector("video");
  // })

});
