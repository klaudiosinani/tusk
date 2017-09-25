'use strict';
const path = require('path');
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
let tray = null;
const settingsURL = 'https://www.evernote.com/Settings.action';
const issueURL = 'https://github.com/champloohq/tusk/issues/new';

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
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Sepia Mode',
    click() {
      showWin();
      activate('toggle-sepia-mode');
    }
  }, {
    label: 'Toggle Dark Mode',
    click() {
      showWin();
      activate('toggle-dark-mode');
    }
  }, {
    label: 'Toggle Black Mode',
    click() {
      showWin();
      activate('toggle-black-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: `Settings`,
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
