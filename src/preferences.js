(function () {

    var ipcRenderer = require('electron').ipcRenderer;

    var AppConfig = require('./../config.js');
    var config = AppConfig.store;

    var remote = require('electron').remote;
    var shell = remote.shell;

    /* Must reflect <input name={GROUP}> in preference.html and configs */
    var groups = [
        'alwaysOnTop',
        'windowPosition',
        'externalLinks',
        'globalShortcuts'
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

    //* Should fill dynamically into HTML */
    var userAgents = {
        linux : 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36',
        ipad : 'Mozilla/5.0 (iPad; CPU OS 9_0 like Mac OS X) AppleWebKit/601.1.17 (KHTML, like Gecko) Version/8.0 Mobile/13A175 Safari/600.1.4',
        iphone : 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        android : 'Mozilla/5.0 (Linux; U; Android 4.2; en-us; Nexus 10 Build/JVP15I) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
        desktop : 'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en-us) AppleWebKit/312.8 (KHTML, like Gecko) Safari/312.6'
    };

    var selectEl = document.getElementById('user-agent');

    for (var i = 0; i < selectEl.options.length; i++) {
        var op = selectEl.options[i];
        if (userAgents[op.value] === config.userAgent) {
            selectEl.options.selectedIndex = op.index;
        }
    }

    var saveButton = document.getElementById('save-btn');

    saveButton.addEventListener('click', function () {
        saveButton.classList.add('is-loading');
        setTimeout(function () {
            saveButton.classList.remove('is-loading');
        }, 500);
        config.userAgent = userAgents[selectEl.options[selectEl.options.selectedIndex].value];
        ipcRenderer.send('updatePreferences', config);
    }, false);


    var githubLinkEl = document.getElementById('github-link');

    githubLinkEl.addEventListener('click', function () {
        shell.openExternal('https://github.com/edanchenkov/menutube');
    });

    var appVersion = document.getElementById('app-version');
    appVersion.innerHTML =  remote.app.getName() + ' v.' + remote.app.getVersion();

})();


