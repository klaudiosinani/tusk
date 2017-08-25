'use strict';
const path = require('path');
const electron = require('electron');

const app = electron.app;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const appName = app.getName();

function activate(command) {
  const appWindow = BrowserWindow.getAllWindows()[0];
  // Extra measure in order to be shown
  appWindow.show();
  appWindow.webContents.send(command);
}

const helpSubmenu = [{
  label: 'Tusk Repo',
  click() {
    shell.openExternal(`https://github.com/champloohq/tusk`);
  }
}, {
  label: `Tusk Homepage`,
  click() {
    shell.openExternal('https://champloohq.github.io/tusk');
  }
}];

if (process.platform !== 'darwin') {
  helpSubmenu.push({
    type: 'separator'
  }, {
    role: 'about',
    click() {
      electron.dialog.showMessageBox({
        title: `About Tusk`,
        message: `Tusk ${app.getVersion()}`,
        detail: '<> with <3 by the Champloo HQ team',
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
      activate('search');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Note',
    accelerator: 'CmdorCtrl+N',
    click() {
      activate('new-note');
    }
  }, {
    label: 'Delete Note',
    accelerator: 'Delete',
    click() {
      activate('delete-note');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Tag',
    accelerator: 'CmdorCtrl+Shift+T',
    click() {
      activate('new-tag');
    }
  }, {
    label: 'New Notebook',
    accelerator: 'CmdorCtrl+Shift+N',
    click() {
      activate('new-notebook');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Set Reminder',
    accelerator: 'CmdorCtrl+E',
    click() {
      activate('set-reminder');
    }
  }, {
    label: 'Add Shortcut',
    accelerator: 'CmdorCtrl+S',
    click() {
      activate('add-shortcut');
    }
  }]
}, {
  label: 'Edit',
  submenu: [{
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
    accelerator: 'CmdOrCtrl+K',
    click() {
      activate('focus-mode');
    }
  }, {
    label: 'Exit Focus Mode',
    accelerator: 'CmdorCtrl+O',
    click() {
      activate('exit-focus-mode');
    }
  }, {
    label: 'Toggle Dark Mode',
    accelerator: 'CmdOrCtrl+D',
    click() {
      activate('toggle-dark-mode');
    }
  }, {
    label: 'Toggle Black Mode',
    accelerator: 'CmdOrCtrl+Alt+E',
    click() {
      activate('toggle-black-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Tags',
    accelerator: 'Shift+Alt+T',
    click() {
      activate('toggle-tags');
    }
  }, {
    label: 'Notebooks',
    accelerator: 'Shift+Alt+N',
    click() {
      activate('toggle-notebooks');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Settings',
    accelerator: 'CmdorCtrl+,',
    click() {
      activate('settings');
    }
  }, {
    label: 'Shortcuts',
    accelerator: 'CmdorCtrl+Shift+S',
    click() {
      activate('shortcuts');
    }
  }, {
    label: 'Return to Notes',
    accelerator: 'Esc',
    click() {
      activate('return');
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
  label: 'Format',
  submenu: [{
    label: 'Style',
    submenu: [{
      label: 'Bold text',
      accelerator: 'CmdorCtrl+B',
      click() {
        activate('bold');
      }
    }, {
      label: 'Italic text',
      accelerator: 'CmdorCtrl+I',
      click() {
        activate('italic');
      }
    }, {
      label: 'Underline text',
      accelerator: 'CmdorCtrl+U',
      click() {
        activate('underline');
      }
    }, {
      label: 'Strikethrough text',
      accelerator: 'CmdorCtrl+T',
      click() {
        activate('strikethrough');
      }
    }]
  }, {
    label: 'Add link',
    accelerator: 'CmdorCtrl+Shift+K',
    click() {
      activate('add-link');
    }
  }, {
    label: 'Attach file',
    accelerator: 'CmdorCtrl+Shift+F',
    click() {
      activate('attach-file');
    }
  }, {
    label: 'Insert from Drive',
    accelerator: 'CmdorCtrl+Shift+D',
    click() {
      activate('insert-drive');
    }
  }, {
    label: 'Paragraph',
    submenu: [{
      label: 'Align left',
      accelerator: 'CmdorCtrl+Alt+L',
      click() {
        activate('align-left');
      }
    }, {
      label: 'Align center',
      accelerator: 'CmdorCtrl+Alt+M',
      click() {
        activate('align-center');
      }
    }, {
      label: 'Align right',
      accelerator: 'CmdorCtrl+Alt+R',
      click() {
        activate('align-right');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Increase indentation',
      accelerator: 'CmdorCtrl+M',
      click() {
        activate('increase-indentation');
      }
    }, {
      label: 'Decrease indentation',
      accelerator: 'CmdorCtrl+Shift+M',
      click() {
        activate('decrease-indentation');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Numbered list',
      accelerator: 'CmdorCtrl+Shift+O',
      click() {
        activate('numbered');
      }
    }, {
      label: 'Bulleted list',
      accelerator: 'CmdorCtrl+Shift+.',
      click() {
        activate('bulleted');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Checkbox',
    accelerator: 'CmdorCtrl+Shift+C',
    click() {
      activate('checkbox');
    }
  }, {
    label: 'Code block',
    accelerator: 'CmdorCtrl+Shift+L',
    click() {
      activate('code-block');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Subscript text',
    accelerator: 'CmdorCtrl+Shift+]',
    click() {
      activate('subscript');
    }
  }, {
    label: 'Superscript text',
    accelerator: 'CmdorCtrl+Shift+[',
    click() {
      activate('superscript');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Insert Horizontal Rule',
    accelerator: 'CmdorCtrl+Shift+-',
    click() {
      activate('horizontal-rule');
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
      activate('search');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Note',
    accelerator: 'CmdorCtrl+N',
    click() {
      activate('new-note');
    }
  }, {
    label: 'Delete Note',
    accelerator: 'Delete',
    click() {
      activate('delete-note');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Tag',
    accelerator: 'CmdorCtrl+Shift+T',
    click() {
      activate('new-tag');
    }
  }, {
    label: 'New Notebook',
    accelerator: 'CmdorCtrl+Shift+N',
    click() {
      activate('new-notebook');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Set Reminder',
    accelerator: 'CmdorCtrl+E',
    click() {
      activate('set-reminder');
    }
  }, {
    label: 'Add Shortcut',
    accelerator: 'CmdorCtrl+S',
    click() {
      activate('add-shortcut');
    }
  }, {
    type: 'separator'
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
    accelerator: 'CmdOrCtrl+K',
    click() {
      activate('focus-mode');
    }
  }, {
    label: 'Exit Focus Mode',
    accelerator: 'CmdorCtrl+O',
    click() {
      activate('exit-focus-mode');
    }
  }, {
    label: 'Toggle Dark Mode',
    accelerator: 'CmdOrCtrl+D',
    click() {
      activate('toggle-dark-mode');
    }
  }, {
    label: 'Toggle Black Mode',
    accelerator: 'CmdOrCtrl+Alt+E',
    click() {
      activate('toggle-black-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Tags',
    accelerator: 'Shift+Alt+T',
    click() {
      activate('toggle-tags');
    }
  }, {
    label: 'Notebooks',
    accelerator: 'Shift+Alt+N',
    click() {
      activate('toggle-notebooks');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Settings',
    accelerator: 'CmdorCtrl+,',
    click() {
      activate('settings');
    }
  }, {
    label: 'Shortcuts',
    accelerator: 'CmdorCtrl+Shift+S',
    click() {
      activate('shortcuts');
    }
  }, {
    label: 'Return to Notes',
    accelerator: 'Esc',
    click() {
      activate('return');
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
  label: 'Format',
  submenu: [{
    label: 'Style',
    submenu: [{
      label: 'Bold text',
      accelerator: 'CmdorCtrl+B',
      click() {
        activate('bold');
      }
    }, {
      label: 'Italic text',
      accelerator: 'CmdorCtrl+I',
      click() {
        activate('italic');
      }
    }, {
      label: 'Underline text',
      accelerator: 'CmdorCtrl+U',
      click() {
        activate('underline');
      }
    }, {
      label: 'Strikethrough text',
      accelerator: 'CmdorCtrl+T',
      click() {
        activate('strikethrough');
      }
    }]
  }, {
    label: 'Add link',
    accelerator: 'CmdorCtrl+Shift+K',
    click() {
      activate('add-link');
    }
  }, {
    label: 'Attach file',
    accelerator: 'CmdorCtrl+Shift+F',
    click() {
      activate('attach-file');
    }
  }, {
    label: 'Insert from Drive',
    accelerator: 'CmdorCtrl+Shift+D',
    click() {
      activate('insert-drive');
    }
  }, {
    label: 'Paragraph',
    submenu: [{
      label: 'Align left',
      accelerator: 'CmdorCtrl+Alt+L',
      click() {
        activate('align-left');
      }
    }, {
      label: 'Align center',
      accelerator: 'CmdorCtrl+Alt+M',
      click() {
        activate('align-center');
      }
    }, {
      label: 'Align right',
      accelerator: 'CmdorCtrl+Alt+R',
      click() {
        activate('align-right');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Increase indentation',
      accelerator: 'CmdorCtrl+M',
      click() {
        activate('indent');
      }
    }, {
      label: 'Decrease indentation',
      accelerator: 'CmdorCtrl+Shift+M',
      click() {
        activate('outdent');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Numbered list',
      accelerator: 'CmdorCtrl+Shift+O',
      click() {
        activate('numbered');
      }
    }, {
      label: 'Bulleted list',
      accelerator: 'CmdorCtrl+Shift+.',
      click() {
        activate('bulleted');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Checkbox',
    accelerator: 'CmdorCtrl+Shift+C',
    click() {
      activate('checkbox');
    }
  }, {
    label: 'Code block',
    accelerator: 'CmdorCtrl+Shift+L',
    click() {
      activate('code-block');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Subscript text',
    accelerator: 'CmdorCtrl+Shift+]',
    click() {
      activate('subscript');
    }
  }, {
    label: 'Superscript text',
    accelerator: 'CmdorCtrl+Shift+[',
    click() {
      activate('superscript');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Insert Horizontal Rule',
    accelerator: 'CmdorCtrl+Shift+-',
    click() {
      activate('horizontal-rule');
    }
  }]
}, {
  role: 'help',
  submenu: helpSubmenu
}];

const tpl = process.platform === 'darwin' ? darwinTpl : otherTpl;

module.exports = electron.Menu.buildFromTemplate(tpl);
