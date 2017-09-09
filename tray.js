'use strict';
const path = require('path');
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
let tray = null;

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
    if (win.isVisible()) {
      win.hide();
    } else {
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
      toggleWin();
      activate('search');
    }
  }, {
    label: 'New Tag',
    click() {
      toggleWin();
      activate('new-tag');
    }
  }, {
    label: 'New Note',
    click() {
      toggleWin();
      activate('new-note');
    }
  }, {
    label: 'New Notebook',
    click() {
      toggleWin();
      activate('new-notebook');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Sepia Mode',
    click() {
      toggleWin();
      activate('toggle-sepia-mode');
    }
  }, {
    label: 'Toggle Dark Mode',
    click() {
      toggleWin();
      activate('toggle-dark-mode');
    }
  }, {
    label: 'Toggle Black Mode',
    click() {
      toggleWin();
      activate('toggle-black-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: `Settings`,
    click() {
      shell.openExternal('https://www.evernote.com/Settings.action');
    }
  }, {
    label: `Report Issue`,
    click() {
      shell.openExternal(`https://github.com/champloohq/tusk/issues/new`);
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
