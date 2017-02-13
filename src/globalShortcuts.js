exports.init = function (wv) {
    var ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.on('global-shortcut', function (e, data) {
        var accelerator = data.accelerator;

        switch (accelerator) {
            case ('MediaNextTrack'):
                wv.send('changeTime', 5);
                break;
            case ('MediaPreviousTrack'):
                wv.send('changeTime', -5);
                break;
            case ('MediaStop'):
                break;
            case ('MediaPlayPause'):
                wv.send('playPause');
                break;
            case ('Cmd+Alt+Y'):
                ipcRenderer.send('toggleWindow');
                break;
        }
    });
};
