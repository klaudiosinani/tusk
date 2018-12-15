'use strict';
const {app} = require('electron');

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
      role: 'quit'
    }
  ]
};
