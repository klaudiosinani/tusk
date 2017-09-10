'use strict';
const Config = require('electron-config');

module.exports = new Config({
  defaults: {
    zoomFactor: 1,
    lastWindowState: {
      width: 900,
      height: 500
    },
    darkMode: false,
    blackMode: false,
    sepiaMode: false,
    vibrantMode: false,
    alwaysOnTop: false,
    useYinxiang: false
  }
});
