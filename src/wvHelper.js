(function () {
    var ipcRenderer = require('electron').ipcRenderer;

    ipcRenderer.on('playPause', function () {
        var video = document.querySelector('video');

        if (typeof video === 'undefined' || video === null) {
            return;
        }

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }

    });

    ipcRenderer.on('pause', function () {
        var video = document.querySelector('video');

        if (typeof video === 'undefined' || video === null) {
            return;
        }

        if (!video.paused) {
            video.pause();
        }

    });

    ipcRenderer.on('changeTime', function (event, time) {
        var video = document.querySelector('video');

        if (typeof video === 'undefined' || video === null) {
            return;
        }

        video.currentTime += time;

    });

    ipcRenderer.on('enterPIPMode', function _retry() {
        var video = document.querySelector('video');

        if (typeof video === 'undefined' || video === null) {
            setTimeout(_retry, 100);
            return;
        }

        if (typeof video !== "undefined") {
            document.body.innerHTML = '';
            document.body.style.backgroundColor = "black";
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.position = 'absolute';
            video.style.top = 0;
            video.style.left = 0;
            video.style.zIndex = 9999;

            document.body.appendChild(video);

            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }

    });

}());
