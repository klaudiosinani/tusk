'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const electron = require('electron');
const config = require('./config');

const app = electron.app;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const appName = app.getName();
const sourceURL = 'https://github.com/champloohq/tusk';
const homepageURL = 'https://champloohq.github.io/tusk';
const issueURL = 'https://github.com/champloohq/tusk/issues/new';
const releaseURL = 'https://github.com/champloohq/tusk/releases/latest';
const keymapFilePath = os.homedir() + '/.tusk/keymap.json';
const keymap = initKeymap();

function activate(command) {
  const appWindow = BrowserWindow.getAllWindows()[0];
  // Extra measure in order to be shown
  appWindow.show();
  appWindow.webContents.send(command);
}

// Returns the default value or the one defined in the keymap,json file
function getAccelerator(command, defaultKeyCombo){
  if (keymap.hasOwnProperty(command)) {
    return keymap[command];
  } else {
    return defaultKeyCombo;
  }
}

// Initializes the keymap file
function initKeymap() {
  if(fs.existsSync(keymapFilePath)){
    return JSON.parse(fs.readFileSync(keymapFilePath, 'utf8'));
  } else {
    return {};
  }
}

const helpSubmenu = [{
  label: `Tusk Homepage`,
  click() {
    shell.openExternal(homepageURL);
  }
}, {
  type: 'separator'
}, {
  label: 'Fork Source',
  click() {
    shell.openExternal(sourceURL);
  }
}, {
  label: `Report Issue`,
  click() {
    shell.openExternal(issueURL);
  }
}, {
  label: `Latest Release`,
  click() {
    shell.openExternal(releaseURL);
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
    label: 'Navigate to Next Note',
    accelerator: getAccelerator('next-note', 'CmdorCtrl+Tab'),
    click() {
      activate('next-note');
    }
  }, {
    label: 'Navigate to Previous Note',
    accelerator: getAccelerator('previous-note', 'CmdorCtrl+Shift+Tab'),
    click() {
      activate('previous-note');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Print Note',
    accelerator: getAccelerator('print', 'CmdorCtrl+Alt+P'),
    click() {
      activate('print');
    }
  }, {
    label: 'Export Note as PDF',
    accelerator: getAccelerator('export', 'CmdorCtrl+Shift+E'),
    click() {
      activate('export');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Switch to Yinxiang',
    visible: !config.get('useYinxiang'),
    click() {
      config.set('useYinxiang', true);
      app.relaunch();
      app.quit();
    }
  }, {
    label: 'Switch to Evernote',
    visible: config.get('useYinxiang'),
    click() {
      config.set('useYinxiang', false);
      app.relaunch();
      app.quit();
    }
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
    accelerator: getAccelerator('search', 'CmdorCtrl+F'),
    click() {
      activate('search');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Note',
    accelerator: getAccelerator('new-note', 'CmdorCtrl+N'),
    click() {
      activate('new-note');
    }
  }, {
    label: 'Delete Note',
    accelerator: getAccelerator('delete-note', 'Delete'),
    click() {
      activate('delete-note');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Tag',
    accelerator: getAccelerator('new-tag', 'CmdorCtrl+Shift+T'),
    click() {
      activate('new-tag');
    }
  }, {
    label: 'New Notebook',
    accelerator: getAccelerator('new-notebook', 'CmdorCtrl+Shift+N'),
    click() {
      activate('new-notebook');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Set Reminder',
    accelerator: getAccelerator('set-reminder', 'CmdorCtrl+E'),
    click() {
      activate('set-reminder');
    }
  }, {
    label: 'Add Shortcut',
    accelerator: getAccelerator('add-shortcut', 'CmdorCtrl+Alt+S'),
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
    accelerator: getAccelerator('reload', 'CmdOrCtrl+Shift+R'),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  }, {
    type: 'separator'
  }, {
    label: 'Make Text Larger',
    accelerator: getAccelerator('zoom-in', 'CmdOrCtrl+Plus'),
    click() {
      activate('zoom-in');
    }
  }, {
    label: 'Make Text Smaller',
    accelerator: getAccelerator('zoom-out', 'CmdOrCtrl+-'),
    click() {
      activate('zoom-out');
    }
  }, {
    label: 'Reset Zoom Level',
    accelerator: getAccelerator('zoom-reset', 'CmdOrCtrl+0'),
    click() {
      activate('zoom-reset');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Focus Mode',
    accelerator: getAccelerator('focus-mode', 'CmdOrCtrl+K'),
    click() {
      activate('focus-mode');
    }
  }, {
    label: 'Exit Focus Mode',
    accelerator: getAccelerator('exit-focus-mode', 'CmdorCtrl+O'),
    click() {
      activate('exit-focus-mode');
    }
  }, {
    label: 'Toggle Sepia Mode',
    accelerator: getAccelerator('toggle-sepia-mode', 'CmdOrCtrl+G'),
    click() {
      activate('toggle-sepia-mode');
    }
  }, {
    label: 'Toggle Dark Mode',
    accelerator: getAccelerator('toggle-dark-mode', 'CmdOrCtrl+D'),
    click() {
      activate('toggle-dark-mode');
    }
  }, {
    label: 'Toggle Black Mode',
    accelerator: getAccelerator('toggle-black-mode', 'CmdOrCtrl+Alt+E'),
    click() {
      activate('toggle-black-mode');
    }
  }, {
    label: 'Toggle Vibrant Mode',
    accelerator: getAccelerator('toggle-vibrant-mode', 'CmdOrCtrl+Alt+U'),
    click() {
      activate('toggle-vibrant-mode');
    }
  }, {
    label: 'Toggle Vibrant Dark Mode',
    accelerator: getAccelerator('toggle-vibrant-dark-mode', 'CmdOrCtrl+Alt+J'),
    click() {
      activate('toggle-vibrant-dark-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Tags',
    accelerator: getAccelerator('toggle-tags', 'Shift+Alt+T'),
    click() {
      activate('toggle-tags');
    }
  }, {
    label: 'Notebooks',
    accelerator: getAccelerator('toggle-notebooks', 'Shift+Alt+N'),
    click() {
      activate('toggle-notebooks');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Settings',
    accelerator: getAccelerator('settings', 'CmdorCtrl+,'),
    click() {
      activate('settings');
    }
  }, {
    label: 'Shortcuts',
    accelerator: getAccelerator('shortcuts', 'CmdorCtrl+Shift+S'),
    click() {
      activate('shortcuts');
    }
  }, {
    label: 'Return to Notes',
    accelerator: getAccelerator('return', 'Esc'),
    click() {
      activate('return');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Full Screen',
    accelerator: getAccelerator('toggle-full-screen', 'Ctrl+Command+F'),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        focusedWindow.send('window:fullscreen', {state: focusedWindow.isFullScreen()});
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: getAccelerator('toggle-developer-tools', 'Alt+Command+I'),
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
      accelerator: getAccelerator('bold', 'CmdorCtrl+B'),
      click() {
        activate('bold');
      }
    }, {
      label: 'Italic text',
      accelerator: getAccelerator('italic', 'CmdorCtrl+I'),
      click() {
        activate('italic');
      }
    }, {
      label: 'Underline text',
      accelerator: getAccelerator('underline', 'CmdorCtrl+U'),
      click() {
        activate('underline');
      }
    }, {
      label: 'Strikethrough text',
      accelerator: getAccelerator('strikethrough', 'CmdorCtrl+T'),
      click() {
        activate('strikethrough');
      }
    }]
  }, {
    label: 'Add link',
    accelerator: getAccelerator('add-link', 'CmdorCtrl+Shift+K'),
    click() {
      activate('add-link');
    }
  }, {
    label: 'Attach file',
    accelerator: getAccelerator('attach-file', 'CmdorCtrl+Shift+F'),
    click() {
      activate('attach-file');
    }
  }, {
    label: 'Insert from Drive',
    accelerator: getAccelerator('insert-drive', 'CmdorCtrl+Shift+D'),
    click() {
      activate('insert-drive');
    }
  }, {
    label: 'Paragraph',
    submenu: [{
      label: 'Align left',
      accelerator: getAccelerator('align-left', 'CmdorCtrl+Alt+L'),
      click() {
        activate('align-left');
      }
    }, {
      label: 'Align center',
      accelerator: getAccelerator('align-center', 'CmdorCtrl+Alt+M'),
      click() {
        activate('align-center');
      }
    }, {
      label: 'Align right',
      accelerator: getAccelerator('align-right', 'CmdorCtrl+Alt+R'),
      click() {
        activate('align-right');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Increase indentation',
      accelerator: getAccelerator('increase-indentation', 'CmdorCtrl+Alt+K'),
      click() {
        activate('increase-indentation');
      }
    }, {
      label: 'Decrease indentation',
      accelerator: getAccelerator('decrease-indentation', 'CmdorCtrl+Shift+M'),
      click() {
        activate('decrease-indentation');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Numbered list',
      accelerator: getAccelerator('numbered', 'CmdorCtrl+Shift+O'),
      click() {
        activate('numbered');
      }
    }, {
      label: 'Bulleted list',
      accelerator: getAccelerator('bulleted', 'CmdorCtrl+Shift+.'),
      click() {
        activate('bulleted');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Checkbox',
    accelerator: getAccelerator('checkbox', 'CmdorCtrl+Shift+C'),
    click() {
      activate('checkbox');
    }
  }, {
    label: 'Code block',
    accelerator: getAccelerator('code-block', 'CmdorCtrl+Shift+L'),
    click() {
      activate('code-block');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Subscript text',
    accelerator: getAccelerator('subscript', 'CmdorCtrl+Shift+]'),
    click() {
      activate('subscript');
    }
  }, {
    label: 'Superscript text',
    accelerator: getAccelerator('superscript', 'CmdorCtrl+Shift+['),
    click() {
      activate('superscript');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Remove Formatting',
    accelerator: getAccelerator('remove-formatting', 'CmdorCtrl+Shift+Space'),
    click() {
      activate('remove-formatting');
    }
  }, {
    label: 'Insert Horizontal Rule',
    accelerator: getAccelerator('horizontal-rule', 'CmdorCtrl+Shift+-'),
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
    accelerator: getAccelerator('search', 'CmdorCtrl+F'),
    click() {
      activate('search');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Note',
    accelerator: getAccelerator('new-note', 'CmdorCtrl+N'),
    click() {
      activate('new-note');
    }
  }, {
    label: 'Delete Note',
    accelerator: getAccelerator('delete-note', 'Delete'),
    click() {
      activate('delete-note');
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Tag',
    accelerator: getAccelerator('new-tag', 'CmdorCtrl+Shift+T'),
    click() {
      activate('new-tag');
    }
  }, {
    label: 'New Notebook',
    accelerator: getAccelerator('new-notebook', 'CmdorCtrl+Shift+N'),
    click() {
      activate('new-notebook');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Set Reminder',
    accelerator: getAccelerator('set-reminder', 'CmdorCtrl+E'),
    click() {
      activate('set-reminder');
    }
  }, {
    label: 'Add Shortcut',
    accelerator: getAccelerator('add-shortcut', 'CmdorCtrl+Alt+S'),
    click() {
      activate('add-shortcut');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Navigate to Next Note',
    accelerator: getAccelerator('next-note', 'CmdorCtrl+Tab'),
    click() {
      activate('next-note');
    }
  }, {
    label: 'Navigate to Previous Note',
    accelerator: getAccelerator('previous-note', 'CmdorCtrl+Shift+Tab'),
    click() {
      activate('previous-note');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Print Note',
    accelerator: getAccelerator('print', 'CmdorCtrl+Alt+P'),
    click() {
      activate('print');
    }
  }, {
    label: 'Export Note as PDF',
    accelerator: getAccelerator('export', 'CmdorCtrl+Shift+E'),
    click() {
      activate('export');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Switch to Yinxiang',
    visible: !config.get('useYinxiang'),
    click() {
      config.set('useYinxiang', true);
      app.relaunch();
      app.quit();
    }
  }, {
    label: 'Switch to Evernote',
    visible: config.get('useYinxiang'),
    click() {
      config.set('useYinxiang', false);
      app.relaunch();
      app.quit();
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
    accelerator: getAccelerator('reload', 'CmdOrCtrl+Shift+R'),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  }, {
    type: 'separator'
  }, {
    label: 'Make Text Larger',
    accelerator: getAccelerator('zoom-in', 'CmdOrCtrl+Plus'),
    click() {
      activate('zoom-in');
    }
  }, {
    label: 'Make Text Smaller',
    accelerator: getAccelerator('zoom-out', 'CmdOrCtrl+-'),
    click() {
      activate('zoom-out');
    }
  }, {
    label: 'Reset Zoom Level',
    accelerator: getAccelerator('zoom-reset', 'CmdOrCtrl+0'),
    click() {
      activate('zoom-reset');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Focus Mode',
    accelerator: getAccelerator('focus-mode', 'CmdOrCtrl+K'),
    click() {
      activate('focus-mode');
    }
  }, {
    label: 'Exit Focus Mode',
    accelerator: getAccelerator('exit-focus-mode', 'CmdorCtrl+O'),
    click() {
      activate('exit-focus-mode');
    }
  }, {
    label: 'Toggle Sepia Mode',
    accelerator: getAccelerator('toggle-sepia-mode', 'CmdOrCtrl+G'),
    click() {
      activate('toggle-sepia-mode');
    }
  }, {
    label: 'Toggle Dark Mode',
    accelerator: getAccelerator('toggle-dark-mode', 'CmdOrCtrl+D'),
    click() {
      activate('toggle-dark-mode');
    }
  }, {
    label: 'Toggle Black Mode',
    accelerator: getAccelerator('toggle-black-mode', 'CmdOrCtrl+Alt+E'),
    click() {
      activate('toggle-black-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Tags',
    accelerator: getAccelerator('toggle-tags', 'Shift+Alt+T'),
    click() {
      activate('toggle-tags');
    }
  }, {
    label: 'Notebooks',
    accelerator: getAccelerator('toggle-notebooks', 'Shift+Alt+N'),
    click() {
      activate('toggle-notebooks');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Settings',
    accelerator: getAccelerator('settings', 'CmdorCtrl+,'),
    click() {
      activate('settings');
    }
  }, {
    label: 'Shortcuts',
    accelerator: getAccelerator('shortcuts', 'CmdorCtrl+Shift+S'),
    click() {
      activate('shortcuts');
    }
  }, {
    label: 'Return to Notes',
    accelerator: getAccelerator('return', 'Esc'),
    click() {
      activate('return');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Full Screen',
    accelerator: getAccelerator('toggle-full-screen', 'F11'),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        focusedWindow.send('window:fullscreen', {state: focusedWindow.isFullScreen()});
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: getAccelerator('toggle-developer-tools', 'Ctrl+Shift+I'),
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
      accelerator: getAccelerator('bold', 'CmdorCtrl+B'),
      click() {
        activate('bold');
      }
    }, {
      label: 'Italic text',
      accelerator: getAccelerator('italic', 'CmdorCtrl+I'),
      click() {
        activate('italic');
      }
    }, {
      label: 'Underline text',
      accelerator: getAccelerator('underline', 'CmdorCtrl+U'),
      click() {
        activate('underline');
      }
    }, {
      label: 'Strikethrough text',
      accelerator: getAccelerator('strikethrough', 'CmdorCtrl+T'),
      click() {
        activate('strikethrough');
      }
    }]
  }, {
    label: 'Add link',
    accelerator: getAccelerator('add-link', 'CmdorCtrl+Shift+K'),
    click() {
      activate('add-link');
    }
  }, {
    label: 'Attach file',
    accelerator: getAccelerator('attach-file', 'CmdorCtrl+Shift+F'),
    click() {
      activate('attach-file');
    }
  }, {
    label: 'Insert from Drive',
    accelerator: getAccelerator('insert-drive', 'CmdorCtrl+Shift+D'),
    click() {
      activate('insert-drive');
    }
  }, {
    label: 'Paragraph',
    submenu: [{
      label: 'Align left',
      accelerator: getAccelerator('align-left', 'CmdorCtrl+Alt+L'),
      click() {
        activate('align-left');
      }
    }, {
      label: 'Align center',
      accelerator: getAccelerator('align-center', 'CmdorCtrl+Alt+M'),
      click() {
        activate('align-center');
      }
    }, {
      label: 'Align right',
      accelerator: getAccelerator('align-right', 'CmdorCtrl+Alt+R'),
      click() {
        activate('align-right');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Increase indentation',
      accelerator: getAccelerator('indent', 'CmdorCtrl+Alt+K'),
      click() {
        activate('indent');
      }
    }, {
      label: 'Decrease indentation',
      accelerator: getAccelerator('outdent', 'CmdorCtrl+Shift+M'),
      click() {
        activate('outdent');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Numbered list',
      accelerator: getAccelerator('numbered', 'CmdorCtrl+Shift+O'),
      click() {
        activate('numbered');
      }
    }, {
      label: 'Bulleted list',
      accelerator: getAccelerator('bulleted', 'CmdorCtrl+Shift+.'),
      click() {
        activate('bulleted');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Checkbox',
    accelerator: getAccelerator('checkbox', 'CmdorCtrl+Shift+C'),
    click() {
      activate('checkbox');
    }
  }, {
    label: 'Code block',
    accelerator: getAccelerator('code-block', 'CmdorCtrl+Shift+L'),
    click() {
      activate('code-block');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Subscript text',
    accelerator: getAccelerator('subscript', 'CmdorCtrl+Shift+]'),
    click() {
      activate('subscript');
    }
  }, {
    label: 'Superscript text',
    accelerator: getAccelerator('superscript', 'CmdorCtrl+Shift+['),
    click() {
      activate('superscript');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Remove Formatting',
    accelerator: getAccelerator('remove-formatting', 'CmdorCtrl+Shift+Space'),
    click() {
      activate('remove-formatting');
    }
  }, {
    label: 'Insert Horizontal Rule',
    accelerator: getAccelerator('horizontal-rule', 'CmdorCtrl+Shift+-'),
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
