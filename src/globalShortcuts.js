exports.init = function (wv) {
  var ipcRenderer = require("electron").ipcRenderer;
  ipcRenderer.on("global-shortcut", function (e, data) {
    var accelerator = data.accelerator;

    switch (accelerator) {
      case "Cmd+Ctrl+Left":
        wv.send("changeTime", -5);
        break;
      case "Cmd+Ctrl+Right":
        wv.send("changeTime", 5);
        break;
      case "Cmd+Ctrl+l":
        wv.send("changeTime", 15);
        break;
      case "Cmd+Ctrl+j":
        wv.send("changeTime", -15);
        break;
      case "Cmd+Ctrl+y":
        ipcRenderer.send("toggleWindow");
        break;
    }
  });
};
