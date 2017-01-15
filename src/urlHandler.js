var urlHandler = {};

module.exports = {
    init : function (wv) {
        var remote = require('electron').remote;
        var shell = remote.shell;

        var that = this;

        /*
         *    Everything related to events below are a huge mess.
         *    Fires multiple times, nothing we can do about it,
         *    unless Electron js fixed it.
         *
         *    USE CAREFULLY!
         *
         * */

        wv.addEventListener('did-navigate-in-page', function (e) {

            urlHandler.currentURL = e.url;

            if (that.isVideoURL(e.url)) {
                urlHandler.videoHistory = urlHandler.videoHistory || [];
                urlHandler.videoHistory.push(e.url);
            }

            if (that.isAllowedURL(e.url)) {
                urlHandler.fullHistory = urlHandler.fullHistory || [];
                urlHandler.fullHistory.push(e.url);
            }
        });

        /**
         *                     START
         *   Hack to prevent user to go to unwanted links.
         *   Must be (!) replaced with proper solution when
         *   https://github.com/electron/electron/issues/1378
         *   gets proper fix
         **/

        wv.addEventListener('did-navigate', function (e) {
            if (!that.isAllowedURL(e.url)) {
                if (e.url === 'about:blank') {
                    wv.goForward();
                } else {
                    wv.goBack();
                }
            }
        });

        wv.addEventListener('will-navigate', function (e) {
            console.log('GOT url', e.url)
            if (!that.isAllowedURL(e.url)) {
                shell.openExternal(e.url)
            }
        });

        /**
         *                     END
         * */
    },
    getCurrentURL : function () {
        return urlHandler.currentURL;
    },
    isVideoURL : function (url) {
        return url.indexOf('.youtube.com/') > -1 &&
            url.indexOf('watch?v=') > -1;
    },
    isAllowedURL : function (url) {
        return (url.indexOf('.youtube.com/') > -1) ||
            (url.indexOf('accounts.google.com') > -1);
    }
};
