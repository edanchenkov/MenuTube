exports.init = function (wv) {
    var ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.on('global-shortcut', function (e, data) {
        wv.send('global-shortcut', data);
    });
};