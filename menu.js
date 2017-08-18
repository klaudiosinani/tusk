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
  label: `${appName} Homepage`,
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
    label: 'Search',
    accelerator: 'CmdorCtrl+F',
    click() {
      sendAction('search');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Note',
    accelerator: 'CmdorCtrl+N',
    click() {
      sendAction('new-note');
    }
  }, {
    label: 'Delete Note',
    accelerator: 'Delete',
    click() {
      sendAction('delete-note');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Tag',
    accelerator: 'CmdorCtrl+Shift+T',
    click() {
      sendAction('new-tag');
    }
  }, {
    label: 'New Notebook',
    accelerator: 'CmdorCtrl+Shift+N',
    click() {
      sendAction('new-notebook');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Set Reminder',
    accelerator: 'CmdorCtrl+E',
    click() {
      sendAction('set-reminder');
    }
  }, {
    label: 'Add Shortcut',
    accelerator: 'CmdorCtrl+S',
    click() {
      sendAction('add-shortcut');
    }
  }]
}, {
  label: 'Edit',
  submenu: [{
    label: 'Bold text',
    accelerator: 'CmdorCtrl+B',
    click() {
      sendAction('bold');
    }
  }, {
    label: 'Italic text',
    accelerator: 'CmdorCtrl+I',
    click() {
      sendAction('italic');
    }
  }, {
    label: 'Underline text',
    accelerator: 'CmdorCtrl+U',
    click() {
      sendAction('underline');
    }
  }, {
    label: 'Checkbox',
    accelerator: 'CmdorCtrl+Shift+C',
    click() {
      sendAction('checkbox');
    }
  }, {
    label: 'Code block',
    accelerator: 'CmdorCtrl+W',
    click() {
      sendAction('code-block');
    }
  }, {
    type: 'separator'
  }, {
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
    accelerator: 'CmdOrCtrl+Shift+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  }, {
    type: 'separator'
  }, {
    label: 'Focus Mode',
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
    type: 'separator'
  }, {
    label: 'Settings',
    accelerator: 'CmdorCtrl+,',
    click() {
      sendAction('settings');
    }
  }, {
    label: 'Shortcuts',
    accelerator: 'CmdorCtrl+Shift+S',
    click() {
      sendAction('shortcuts');
    }
  }, {
    label: 'Return to Notes',
    accelerator: 'Esc',
    click() {
      sendAction('return');
    }
  }, {
    type: 'separator'
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
    label: 'Search',
    accelerator: 'CmdorCtrl+F',
    click() {
      sendAction('search');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Note',
    accelerator: 'CmdorCtrl+N',
    click() {
      sendAction('new-note');
    }
  }, {
    label: 'Delete Note',
    accelerator: 'Delete',
    click() {
      sendAction('delete-note');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Tag',
    accelerator: 'CmdorCtrl+Shift+T',
    click() {
      sendAction('new-tag');
    }
  }, {
    label: 'New Notebook',
    accelerator: 'CmdorCtrl+Shift+N',
    click() {
      sendAction('new-notebook');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Set Reminder',
    accelerator: 'CmdorCtrl+E',
    click() {
      sendAction('set-reminder');
    }
  }, {
    label: 'Add Shortcut',
    accelerator: 'CmdorCtrl+S',
    click() {
      sendAction('add-shortcut');
    }
  }, {
    type: 'separator'
  }, {
    role: 'quit'
  }]
}, {
  label: 'Edit',
  submenu: [{
    label: 'Bold text',
    accelerator: 'CmdorCtrl+B',
    click() {
      sendAction('bold');
    }
  }, {
    label: 'Italic text',
    accelerator: 'CmdorCtrl+I',
    click() {
      sendAction('italic');
    }
  }, {
    label: 'Underline text',
    accelerator: 'CmdorCtrl+U',
    click() {
      sendAction('underline');
    }
  }, {
    label: 'Checkbox',
    accelerator: 'CmdorCtrl+Shift+C',
    click() {
      sendAction('checkbox');
    }
  }, {
    label: 'Code block',
    accelerator: 'CmdorCtrl+W',
    click() {
      sendAction('code-block');
    }
  }, {
    type: 'separator'
  }, {
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
    accelerator: 'CmdOrCtrl+Shift+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  }, {
    type: 'separator'
  }, {
    label: 'Focus Mode',
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
    type: 'separator'
  }, {
    label: 'Settings',
    accelerator: 'CmdorCtrl+,',
    click() {
      sendAction('settings');
    }
  }, {
    label: 'Shortcuts',
    accelerator: 'CmdorCtrl+Shift+S',
    click() {
      sendAction('shortcuts');
    }
  }, {
    label: 'Return to Notes',
    accelerator: 'Esc',
    click() {
      sendAction('return');
    }
  }, {
    type: 'separator'
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
