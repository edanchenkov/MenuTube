(function () {

    var ipcRenderer = require('electron').ipcRenderer;

    var AppConfig = require('./../config.js');
    var config = AppConfig.store.userPreferences;

    var remote = require('electron').remote;
    var shell = remote.shell;

    /* Must reflect <input name={GROUP}> in preference.html and configs */
    var groups = [
        'alwaysOnTop',
        'windowResize',
        'windowDraggable',
        'windowPosition',
        'externalLinks',
        'globalShortcuts',
        'PIPModeByDefault',
        'highlightTray',
        'rememberBounds',
        'theme'
    ];

    var translateValue = function (value) {
        if (value === 'yes') {
            value = true;
        } else if (value === 'no') {
            value = false;
        }
        return value;
    };

    for (var key in config) {
        var value = config[key];
        if (groups.indexOf(key) >= 0) {
            var elements = document.querySelectorAll('input[name="' + key + '"]');

            for (var i = 0; i < elements.length; i++) {
                var input = elements[i];
                var inputValue = input.value;

                inputValue = translateValue(inputValue);
                input.checked = inputValue === value;

                input.onclick = function (e) {
                    var target = e.target;
                    config[target.name] = translateValue(target.value);
                }
            }
        }
    }

    var saveButton = document.getElementById('save-btn');

    saveButton.addEventListener('click', function () {
        saveButton.classList.add('is-loading');
        setTimeout(function () {
            saveButton.classList.remove('is-loading');
        }, 500);
        // config.userAgent = userAgents[selectEl.options[selectEl.options.selectedIndex].value];
        ipcRenderer.send('updatePreferences', config);
    }, false);


    var githubLinkEl = document.getElementById('github-link');

    githubLinkEl.addEventListener('click', function () {
        shell.openExternal('https://github.com/edanchenkov/menutube');
    });

    var appVersion = document.getElementById('app-version');
    appVersion.innerHTML = remote.app.getName() + ' v.' + remote.app.getVersion();

})();


