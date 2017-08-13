'use strict';
const Config = require('electron-config');

module.exports = new Config({
  defaults: {
    zoomFactor: 1,
    autoHideMenuBar: true,
    lastWindowState: {
      width: 800,
      height: 600
    },
    lastURL: 'https://www.evernote.com/Login.action'
  }
});
