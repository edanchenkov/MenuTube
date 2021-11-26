const _newListener = document.addEventListener;

// Hijack event listener to prevent YouTube from stopping on blue window (lose focus)
document.addEventListener = () => {
    _newListener.apply(document, arguments);
};

(function () {
    var AppConfig = require('./../config.js');
    var config = AppConfig.store.userPreferences;

    if (!!config.adBlock) {
        var observeDOM = (function () {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            return function (obj, callback) {
                if (!obj || !obj.nodeType === 1) {
                    return;
                } // validation

                if (MutationObserver) {
                    // define a new observer
                    var obs = new MutationObserver(function (mutations, observer) {
                        callback(mutations);
                    });
                    // have the observer observe foo for changes in children
                    obs.observe(obj, { childList: true, subtree: true });
                } else if (window.addEventListener) {
                    obj.addEventListener('DOMNodeInserted', callback, false);
                    obj.addEventListener('DOMNodeRemoved', callback, false);
                }
            }
        })();

        _newListener('DOMContentLoaded', () => {
            observeDOM(document.body, function (m) {
                const _check = v => v !== null && v !== undefined;
                const ad = [...document.querySelectorAll('.ad-showing')][0];
                if (_check(ad)) {
                    const video = document.querySelector('video');
                    if (_check(video) && !isNaN(video.duration)) {
                        video.currentTime = video.duration;
                    }
                }
            });
        });

    }

    var ipcRenderer = require('electron').ipcRenderer;
    var attempts = 1000;

    var setStream = function (video) {
        var id = video.id.replace('player_', '');
        var stream = '<iframe src="https://www.youtube.com/embed/' + id + '" style="width: 100%; height: 100%;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
        document.body.innerHTML = stream;
    };

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

        if(!document.URL.includes('watch?v=')) {
            return;
        }

        if (typeof video === 'undefined' || video === null) {
            if (attempts > 0) {
                setTimeout(_retry, 100);
                attempts--;
            } else {
                attempts = 1000;
            }
            return;
        }

        if (typeof video !== "undefined") {
            document.body.innerHTML = '';
            document.body.style.backgroundColor = "black";
            document.body.className = '';
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.position = 'absolute';
            video.style.top = 0;
            video.style.left = 0;
            video.style.zIndex = 9999;

            document.body.appendChild(video);

            setTimeout(function () {
                video.play();
            }, 100);
        }
    });

    ipcRenderer.on('onDidNavigateVideoPage', function _retry(event, url) {
        var video = document.querySelector('video');

        if (typeof video === 'undefined' || video === null) {
            if (attempts > 0) {
                setTimeout(_retry, 100);
                attempts--;
            } else {
                attempts = 1000;
            }
            return;
        }

        if (typeof video === 'undefined') {
            return;
        }

        if (video.src.indexOf('m3u8') > -1) {
            setStream(video);
        }
    });

}());
