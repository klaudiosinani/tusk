'use strict';
const Config = require('electron-config');

module.exports = new Config({
  defaults: {
    zoomFactor: 1,
    lastWindowState: {
      width: 900,
      height: 500
    },
    menuBarVisible: true,
    sideBarHidden: false,
    launchMinimized: false,
    autoNightMode: false,
    autoLaunch: false,
    hideTray: false,
    darkMode: false,
    blackMode: false,
    sepiaMode: false,
    vibrantMode: false,
    vibrantDarkMode: false,
    alwaysOnTop: false,
    useYinxiang: false
  }
});
