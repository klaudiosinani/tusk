'use strict';
const Config = require('electron-config');

module.exports = new Config({
  defaults: {
    zoomFactor: 1,
    lastWindowState: {
      width: 840,
      height: 840
    },
    lastURL: 'https://www.evernote.com/Login.action'
  }
});
