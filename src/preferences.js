(function () {

    var ipcRenderer = require('electron').ipcRenderer;

    var AppConfig = require('./../config.js');
    var config = AppConfig.store;

    /* Must reflect <input name={GROUP}> in preference.html and configs */
    var groups = [
        'alwaysOnTop',
        'windowPosition',
        'externalLinks',
        'mediaButton'
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

    var userAgents = {
        linux : 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36',
        ipad : 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        iphone : 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        android : 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Mobile Safari/537.36',
        desktop : ''
    };

    var selectEl = document.getElementById('user-agent');

    for (var i = 0; i < selectEl.options.length; i++) {
        var op = selectEl.options[i];
        if (userAgents[op.value] === config.userAgent) {
            console.log(op.index)
            selectEl.options.selectedIndex = op.index;
        } else {
            console.log(op.value, config.userAgent)
        }

    }

    var saveButton = document.getElementById('save-btn');

    saveButton.addEventListener('click', function () {
        saveButton.classList.add('is-loading');
        setTimeout(function () {
            saveButton.classList.remove('is-loading');
        }, 500);
        config.userAgent = userAgents[selectEl.options[selectEl.selectedIndex].value];
        console.log(userAgents[selectEl.options[selectEl.selectedIndex].value])
        console.log(selectEl.options)
        console.log(selectEl.selectedIndex)
        ipcRenderer.send('updatePreferences', config);
    }, false);

})();


