'use strict';
const path = require('path');
const electron = require('electron');

const app = electron.app;
let tray = null;

exports.create = win => {
  if (process.platform === 'darwin' || tray) {
    return;
  }

  const toggleWin = () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  };

  const contextMenu = electron.Menu.buildFromTemplate([{
    label: 'Toggle',
    click() {
      toggleWin();
    }
  }, {
    type: 'separator'
  }, {
    role: 'quit'
  }]);
};
