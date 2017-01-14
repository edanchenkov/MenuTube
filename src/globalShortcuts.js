exports.init = function (wv) {
    var ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.on('global-shortcut', function (e, data) {
        // wv.send('global-shortcut', data);
        var accelerator = data.accelerator;

        switch (accelerator) {
            case ('MediaNextTrack'):
                break;
            case ('MediaPreviousTrack'):
                break;
            case ('MediaStop'):
                break;
            case ('MediaPlayPause'):
                wv.send('playPause');
                break;
        }
    });
};
