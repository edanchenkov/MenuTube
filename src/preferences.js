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

    var saveButton = document.getElementById('save-btn');

    saveButton.addEventListener('click', function () {
        ipcRenderer.send('updatePreferences', config);
    }, false);

})();


