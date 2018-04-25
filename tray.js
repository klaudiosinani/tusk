'use strict';
const path = require('path');
const electron = require('electron');
const config = require('./config');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
let tray = null;
const settingsURL = 'https://www.evernote.com/Settings.action';
const issueURL = 'https://github.com/klauscfhq/tusk/issues/new';

function activate(command) {
  const appWindow = BrowserWindow.getAllWindows()[0];
  // Extra measure in order to be shown
  appWindow.show();
  appWindow.webContents.send(command);
}

exports.create = win => {
  if (process.platform === 'darwin' || tray) {
    return;
  }

  const iconPath = path.join(__dirname, 'static/IconTray.png');

  const toggleWin = () => {
    // Toggle/untoggle window
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  };

  const showWin = () => {
    // Bring window on top if not visible
    if (!win.isVisible()) {
      win.show();
    }
  };

  const contextMenu = electron.Menu.buildFromTemplate([{
    label: 'Open Tusk',
    click() {
      toggleWin();
    }
  }, {
    type: 'separator'
  }, {
    label: 'Search',
    click() {
      showWin();
      activate('search');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Create',
    submenu: [{
      label: 'New Tag',
      click() {
        showWin();
        activate('new-tag');
      }
    }, {
      label: 'New Note',
      click() {
        showWin();
        activate('new-note');
      }
    }, {
      label: 'New Notebook',
      click() {
        showWin();
        activate('new-notebook');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Theme',
    submenu: [{
      label: 'Sepia Theme',
      click() {
        showWin();
        activate('toggle-sepia-mode');
      }
    }, {
      label: 'Dark Theme',
      click() {
        showWin();
        activate('toggle-dark-mode');
      }
    }, {
      label: 'Black Theme',
      click() {
        showWin();
        activate('toggle-black-mode');
      }
    }]
  }, {
    label: 'Auto Night Mode',
    type: 'checkbox',
    checked: config.get('autoNightMode'),
    click(item) {
      showWin();
      config.set('autoNightMode', item.checked);
      activate('auto-night-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: `Evernote Settings`,
    click() {
      shell.openExternal(settingsURL);
    }
  }, {
    label: `Report Issue`,
    click() {
      shell.openExternal(issueURL);
    }
  }, {
    type: 'separator'
  }, {
    role: 'quit'
  }]);

  tray = new electron.Tray(iconPath);
  tray.setToolTip(`${app.getName()}`);
  tray.setContextMenu(contextMenu);
  tray.on('click', toggleWin);
};
