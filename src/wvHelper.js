(function () {
    var ipcRenderer = require('electron').ipcRenderer;

    ipcRenderer.on("global-shortcut", function (e, data) {
        var accelerator = data.accelerator;
        var video = document.querySelector('video');

        if (typeof video === 'undefined' || video === null) {
            return;
        }

        switch (accelerator) {
            case ('MediaNextTrack'):
                break;
            case ('MediaPreviousTrack'):
                break;
            case ('MediaStop'):
                break;
            case ('MediaPlayPause'):
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }

                break;
        }
    });

}());
