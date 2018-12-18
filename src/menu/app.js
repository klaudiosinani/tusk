'use strict';
const {app} = require('electron');
const dialog = require('./../dialog');

module.exports = {
  label: app.getName(),
  submenu: [
    {
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      role: 'hide'
    }, {
      role: 'hideothers'
    }, {
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: 'Exit',
      click() {
        dialog.confirmExit();
      }
    }
  ]
};
