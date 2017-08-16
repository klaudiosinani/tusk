'use strict';
const os = require('os');
const path = require('path');
const electron = require('electron');

const app = electron.app;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const appName = app.getName();

function sendAction(action) {
  const [win] = BrowserWindow.getAllWindows();

  if (process.platform === 'darwin') {
    win.restore();
  }

  win.webContents.send(action);
}

const helpSubmenu = [{
  label: `${appName} Website`,
  click() {
    shell.openExternal('https://github.com/champloohq/tusk');
  }
}, {
  label: 'Report an Issue',
  click() {
    const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->
-
${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`;

    shell.openExternal(`https://github.com/champloohq/tusk/issues/new?body=${encodeURIComponent(body)}`);
  }
}];

if (process.platform !== 'darwin') {
  helpSubmenu.push({
    type: 'separator'
  }, {
    role: 'about',
    click() {
      electron.dialog.showMessageBox({
        title: `About ${appName}`,
        message: `${appName} ${app.getVersion()}`,
        detail: 'Created by the Champloo HQ team',
        icon: path.join(__dirname, 'static/Icon.png'),
        buttons: []
      });
    }
  });
}

const darwinTpl = [{
  label: appName,
  submenu: [{
    role: 'about'
  }, {
    type: 'separator'
  }, {
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
  }]
}, {
  label: 'File',
  submenu: [{
    label: 'New Note',
    accelerator: 'CmdorCtrl+N',
    click() {
      sendAction('new-note');
    }
  }, {
    label: 'Delete Note',
    accelerator: 'CmdorCtrl+D',
    click() {
      sendAction('delete-note');
    }
  }, {
    label: 'Search',
    accelerator: 'CmdorCtrl+F',
    click() {
      sendAction('search');
    }
  }]
}, {
  label: 'Edit',
  submenu: [{
    role: 'undo'
  }, {
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    role: 'cut'
  }, {
    role: 'copy'
  }, {
    role: 'paste'
  }, {
    role: 'pasteandmatchstyle'
  }, {
    role: 'delete'
  }, {
    role: 'selectall'
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  }, {
    label: 'Toggle Focus Mode',
    accelerator: 'CmdOrCtrl+M',
    click() {
      sendAction('focus-mode');
    }
  }, {
    label: 'Exit Focus Mode',
    accelerator: 'CmdorCtrl+K',
    click() {
      sendAction('exit-focus-mode');
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: 'Ctrl+Command+F',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        focusedWindow.send('window:fullscreen', {state: focusedWindow.isFullScreen()});
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: 'Alt+Command+I',
    click: (item, focusedWindow) => {
      focusedWindow.toggleDevTools();
    }
  }]
}, {
  role: 'window',
  submenu: [{
    role: 'minimize'
  }, {
    role: 'close'
  }, {
    type: 'separator'
  }, {
    type: 'separator'
  }, {
    role: 'front'
  }, {
    role: 'togglefullscreen'
  }]
}, {
  role: 'help',
  submenu: helpSubmenu
}];

const otherTpl = [{
  label: 'File',
  submenu: [{
    label: 'New Note',
    accelerator: 'CmdorCtrl+N',
    click() {
      sendAction('new-note');
    }
  }, {
    label: 'Delete Note',
    accelerator: 'CmdorCtrl+D',
    click() {
      sendAction('delete-note');
    }
  }, {
    label: 'Search',
    accelerator: 'CmdorCtrl+F',
    click() {
      sendAction('search');
    }
  }, {
    role: 'quit'
  }]
}, {
  label: 'Edit',
  submenu: [{
    role: 'undo'
  }, {
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    role: 'cut'
  }, {
    role: 'copy'
  }, {
    role: 'paste'
  }, {
    role: 'pasteandmatchstyle'
  }, {
    role: 'delete'
  }, {
    type: 'separator'
  }, {
    role: 'selectall'
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  }, {
    label: 'Toggle Focus Mode',
    accelerator: 'CmdOrCtrl+M',
    click() {
      sendAction('focus-mode');
    }
  }, {
    label: 'Exit Focus Mode',
    accelerator: 'CmdorCtrl+K',
    click() {
      sendAction('exit-focus-mode');
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: 'F11',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        focusedWindow.send('window:fullscreen', {state: focusedWindow.isFullScreen()});
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: 'Ctrl+Shift+I',
    click: (item, focusedWindow) => {
      focusedWindow.toggleDevTools();
    }
  }]
}, {
  role: 'help',
  submenu: helpSubmenu
}];

const tpl = process.platform === 'darwin' ? darwinTpl : otherTpl;

module.exports = electron.Menu.buildFromTemplate(tpl);
