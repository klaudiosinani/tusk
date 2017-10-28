'use strict';
const os = require('os');
const path = require('path');
const electron = require('electron');
const fs = require('fs-extra');
const config = require('./config');

const join = path.join;
const app = electron.app;
const shell = electron.shell;
const appName = app.getName();
const BrowserWindow = electron.BrowserWindow;

let configData;
const tuskJSON = '.tusk.json'; // Config file name
const homeDir = os.homedir();
const homeConfig = join(homeDir, tuskJSON); // Config file on home directory
const defaultConfig = join(__dirname, '.', tuskJSON); // Default config file directory

const sourceURL = 'https://github.com/klauscfhq/tusk';
const homepageURL = 'https://klauscfhq.github.io/tusk';
const communityURL = 'https://gitter.im/klauscfhq/tusk';
const issueURL = 'https://github.com/klauscfhq/tusk/issues/new';
const releaseURL = 'https://github.com/klauscfhq/tusk/releases/latest';

function activate(command) {
  const appWindow = BrowserWindow.getAllWindows()[0];
  // Extra measure in order to be shown
  appWindow.show();
  appWindow.webContents.send(command);
}

function getConfig() {
  // Create a new default config file
  // if it does not already exist
  if (!fs.existsSync(homeConfig)) {
    try {
      fs.copySync(defaultConfig, homeConfig);
      console.log('Tusk config file was created successfully');
    } catch (err) {
      console.error(err);
    }
  }
  // Parse the content of the config file
  try {
    configData = JSON.parse(fs.readFileSync(homeConfig, 'utf8'));
  } catch (err) {
    console.log('Invalid JSON object');
  }
  return configData;
}

// Get the user-defined settings
const tuskConfig = getConfig();

function setAcc(custom, predifined) {
  // Return the custom or predifined shortcut keys
  if (Object.prototype.hasOwnProperty.call(tuskConfig.shortcutKeys, custom)) {
    return tuskConfig.shortcutKeys[custom];
  }
  return predifined;
}

const helpSubmenu = [{
  label: `Tusk Homepage`,
  click() {
    shell.openExternal(homepageURL);
  }
}, {
  label: 'Version ' + app.getVersion(),
  enabled: false
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
  label: `Community Discussion`,
  click() {
    shell.openExternal(communityURL);
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
        detail: 'Coded with love by Klaus Sinani',
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
    accelerator: setAcc('search', 'CmdorCtrl+F'),
    click() {
      activate('search');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Create',
    submenu: [{
      label: 'New Note',
      accelerator: setAcc('new-note', 'CmdorCtrl+N'),
      click() {
        activate('new-note');
      }
    }, {
      label: 'Delete Note',
      accelerator: setAcc('delete-note', 'Delete'),
      click() {
        activate('delete-note');
      }
    }, {
      type: 'separator'
    }, {
      label: 'New Tag',
      accelerator: setAcc('new-tag', 'CmdorCtrl+Shift+T'),
      click() {
        activate('new-tag');
      }
    }, {
      label: 'New Notebook',
      accelerator: setAcc('new-notebook', 'CmdorCtrl+Shift+N'),
      click() {
        activate('new-notebook');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Set Reminder',
      accelerator: setAcc('set-reminder', 'CmdorCtrl+E'),
      click() {
        activate('set-reminder');
      }
    }, {
      label: 'Add Shortcut',
      accelerator: setAcc('add-shortcut', 'CmdorCtrl+Alt+S'),
      click() {
        activate('add-shortcut');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Navigate',
    submenu: [{
      label: 'Tags',
      accelerator: setAcc('toggle-tags', 'Shift+Alt+T'),
      click() {
        activate('toggle-tags');
      }
    }, {
      label: 'Shortcuts',
      accelerator: setAcc('shortcuts', 'CmdorCtrl+Shift+S'),
      click() {
        activate('shortcuts');
      }
    }, {
      label: 'Notebooks',
      accelerator: setAcc('toggle-notebooks', 'Shift+Alt+N'),
      click() {
        activate('toggle-notebooks');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Return to Notes',
      accelerator: setAcc('return', 'Esc'),
      click() {
        activate('return');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Print Note',
    accelerator: setAcc('print', 'CmdorCtrl+Alt+P'),
    click() {
      activate('print');
    }
  }, {
    label: 'Export Note as PDF',
    accelerator: setAcc('export', 'CmdorCtrl+Shift+E'),
    click() {
      activate('export');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Settings',
    accelerator: setAcc('settings', 'CmdorCtrl+,'),
    click() {
      activate('settings');
    }
  }, {
    label: 'Edit Shortcut Keys',
    accelerator: 'CmdorCtrl+.',
    click() {
      activate('edit-shortcuts');
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
    label: 'Font Size Options',
    submenu: [{
      label: 'Make Text Larger',
      accelerator: 'CmdOrCtrl+Plus',
      click() {
        activate('zoom-in');
      }
    }, {
      label: 'Make Text Smaller',
      accelerator: 'CmdOrCtrl+-',
      click() {
        activate('zoom-out');
      }
    }, {
      label: 'Reset Zoom Level',
      accelerator: 'CmdOrCtrl+0',
      click() {
        activate('zoom-reset');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Focus Mode',
    accelerator: setAcc('focus-mode', 'CmdOrCtrl+K'),
    click() {
      activate('focus-mode');
    }
  }, {
    label: 'Exit Focus Mode',
    accelerator: setAcc('exit-focus-mode', 'CmdorCtrl+O'),
    click() {
      activate('exit-focus-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Theme',
    submenu: [{
      label: 'Sepia Theme',
      accelerator: setAcc('toggle-sepia-mode', 'CmdOrCtrl+G'),
      click() {
        activate('toggle-sepia-mode');
      }
    }, {
      label: 'Dark Theme',
      accelerator: setAcc('toggle-dark-mode', 'CmdOrCtrl+D'),
      click() {
        activate('toggle-dark-mode');
      }
    }, {
      label: 'Black Theme',
      accelerator: setAcc('toggle-black-mode', 'CmdOrCtrl+Alt+E'),
      click() {
        activate('toggle-black-mode');
      }
    }, {
      label: 'Vibrant Theme',
      accelerator: setAcc('toggle-vibrant-mode', 'CmdOrCtrl+Alt+U'),
      click() {
        activate('toggle-vibrant-mode');
      }
    }, {
      label: 'Vibrant Dark Theme',
      accelerator: setAcc('toggle-vibrant-dark-mode', 'CmdOrCtrl+Alt+J'),
      click() {
        activate('toggle-vibrant-dark-mode');
      }
    }]
  }, {
    label: 'Auto Night Mode',
    type: 'checkbox',
    checked: config.get('autoNightMode'),
    accelerator: 'CmdorCtrl+Alt+N',
    click(item) {
      config.set('autoNightMode', item.checked);
      activate('auto-night-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Navigate to Next Note',
    accelerator: 'CmdorCtrl+Tab',
    click() {
      activate('next-note');
    }
  }, {
    label: 'Navigate to Previous Note',
    accelerator: 'CmdorCtrl+Shift+Tab',
    click() {
      activate('previous-note');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Always on Top',
    type: 'checkbox',
    checked: config.get('alwaysOnTop'),
    accelerator: 'CmdorCtrl+Shift+P',
    click(item, focusedWindow) {
      config.set('alwaysOnTop', item.checked);
      focusedWindow.setAlwaysOnTop(item.checked);
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
      accelerator: setAcc('bold', 'CmdorCtrl+B'),
      click() {
        activate('bold');
      }
    }, {
      label: 'Italic text',
      accelerator: setAcc('italic', 'CmdorCtrl+I'),
      click() {
        activate('italic');
      }
    }, {
      label: 'Underline text',
      accelerator: setAcc('underline', 'CmdorCtrl+U'),
      click() {
        activate('underline');
      }
    }, {
      label: 'Strikethrough text',
      accelerator: setAcc('strikethrough', 'CmdorCtrl+T'),
      click() {
        activate('strikethrough');
      }
    }]
  }, {
    label: 'Add link',
    accelerator: setAcc('add-link', 'CmdorCtrl+Shift+K'),
    click() {
      activate('add-link');
    }
  }, {
    label: 'Attach file',
    accelerator: setAcc('attach-file', 'CmdorCtrl+Shift+F'),
    click() {
      activate('attach-file');
    }
  }, {
    label: 'Insert from Drive',
    accelerator: setAcc('insert-drive', 'CmdorCtrl+Shift+D'),
    click() {
      activate('insert-drive');
    }
  }, {
    label: 'Paragraph',
    submenu: [{
      label: 'Align left',
      accelerator: setAcc('align-left', 'CmdorCtrl+Alt+L'),
      click() {
        activate('align-left');
      }
    }, {
      label: 'Align center',
      accelerator: setAcc('align-center', 'CmdorCtrl+Alt+M'),
      click() {
        activate('align-center');
      }
    }, {
      label: 'Align right',
      accelerator: setAcc('align-right', 'CmdorCtrl+Alt+R'),
      click() {
        activate('align-right');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Increase indentation',
      accelerator: setAcc('increase-indentation', 'CmdorCtrl+Alt+K'),
      click() {
        activate('increase-indentation');
      }
    }, {
      label: 'Decrease indentation',
      accelerator: setAcc('decrease-indentation', 'CmdorCtrl+Shift+M'),
      click() {
        activate('decrease-indentation');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Numbered list',
      accelerator: setAcc('numbered', 'CmdorCtrl+Shift+O'),
      click() {
        activate('numbered');
      }
    }, {
      label: 'Bulleted list',
      accelerator: setAcc('bulleted', 'CmdorCtrl+Shift+.'),
      click() {
        activate('bulleted');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Checkbox',
    accelerator: setAcc('checkbox', 'CmdorCtrl+Shift+C'),
    click() {
      activate('checkbox');
    }
  }, {
    label: 'Code block',
    accelerator: setAcc('code-block', 'CmdorCtrl+Shift+L'),
    click() {
      activate('code-block');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Subscript text',
    accelerator: setAcc('subscript', 'CmdorCtrl+Shift+]'),
    click() {
      activate('subscript');
    }
  }, {
    label: 'Superscript text',
    accelerator: setAcc('superscript', 'CmdorCtrl+Shift+['),
    click() {
      activate('superscript');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Remove Formatting',
    accelerator: setAcc('remove-formatting', 'CmdorCtrl+Shift+Space'),
    click() {
      activate('remove-formatting');
    }
  }, {
    label: 'Insert Horizontal Rule',
    accelerator: setAcc('horizontal-rule', 'CmdorCtrl+Shift+-'),
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
    accelerator: setAcc('search', 'CmdorCtrl+F'),
    click() {
      activate('search');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Create',
    submenu: [{
      label: 'New Note',
      accelerator: setAcc('new-note', 'CmdorCtrl+N'),
      click() {
        activate('new-note');
      }
    }, {
      label: 'Delete Note',
      accelerator: setAcc('delete-note', 'Delete'),
      click() {
        activate('delete-note');
      }
    }, {
      type: 'separator'
    }, {
      label: 'New Tag',
      accelerator: setAcc('new-tag', 'CmdorCtrl+Shift+T'),
      click() {
        activate('new-tag');
      }
    }, {
      label: 'New Notebook',
      accelerator: setAcc('new-notebook', 'CmdorCtrl+Shift+N'),
      click() {
        activate('new-notebook');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Set Reminder',
      accelerator: setAcc('set-reminder', 'CmdorCtrl+E'),
      click() {
        activate('set-reminder');
      }
    }, {
      label: 'Add Shortcut',
      accelerator: setAcc('add-shortcut', 'CmdorCtrl+Alt+S'),
      click() {
        activate('add-shortcut');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Navigate',
    submenu: [{
      label: 'Tags',
      accelerator: setAcc('toggle-tags', 'Shift+Alt+T'),
      click() {
        activate('toggle-tags');
      }
    }, {
      label: 'Shortcuts',
      accelerator: setAcc('shortcuts', 'CmdorCtrl+Shift+S'),
      click() {
        activate('shortcuts');
      }
    }, {
      label: 'Notebooks',
      accelerator: setAcc('toggle-notebooks', 'Shift+Alt+N'),
      click() {
        activate('toggle-notebooks');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Return to Notes',
      accelerator: setAcc('return', 'Esc'),
      click() {
        activate('return');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Print Note',
    accelerator: setAcc('print', 'CmdorCtrl+Alt+P'),
    click() {
      activate('print');
    }
  }, {
    label: 'Export Note as PDF',
    accelerator: setAcc('export', 'CmdorCtrl+Shift+E'),
    click() {
      activate('export');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Settings',
    accelerator: setAcc('settings', 'CmdorCtrl+,'),
    click() {
      activate('settings');
    }
  }, {
    label: 'Edit Shortcut Keys',
    accelerator: 'CmdorCtrl+.',
    click() {
      activate('edit-shortcuts');
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
    accelerator: 'CmdOrCtrl+Shift+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  }, {
    type: 'separator'
  }, {
    label: 'Font Size Options',
    submenu: [{
      label: 'Make Text Larger',
      accelerator: 'CmdOrCtrl+Plus',
      click() {
        activate('zoom-in');
      }
    }, {
      label: 'Make Text Smaller',
      accelerator: 'CmdOrCtrl+-',
      click() {
        activate('zoom-out');
      }
    }, {
      label: 'Reset Zoom Level',
      accelerator: 'CmdOrCtrl+0',
      click() {
        activate('zoom-reset');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Focus Mode',
    accelerator: setAcc('focus-mode', 'CmdOrCtrl+K'),
    click() {
      activate('focus-mode');
    }
  }, {
    label: 'Exit Focus Mode',
    accelerator: setAcc('exit-focus-mode', 'CmdorCtrl+O'),
    click() {
      activate('exit-focus-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Theme',
    submenu: [{
      label: 'Sepia Theme',
      accelerator: setAcc('toggle-sepia-mode', 'CmdOrCtrl+G'),
      click() {
        activate('toggle-sepia-mode');
      }
    }, {
      label: 'Dark Theme',
      accelerator: setAcc('toggle-dark-mode', 'CmdOrCtrl+D'),
      click() {
        activate('toggle-dark-mode');
      }
    }, {
      label: 'Black Theme',
      accelerator: setAcc('toggle-black-mode', 'CmdOrCtrl+Alt+E'),
      click() {
        activate('toggle-black-mode');
      }
    }]
  }, {
    label: 'Auto Night Mode',
    type: 'checkbox',
    checked: config.get('autoNightMode'),
    accelerator: 'CmdorCtrl+Alt+N',
    click(item) {
      config.set('autoNightMode', item.checked);
      activate('auto-night-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Navigate to Next Note',
    accelerator: 'CmdorCtrl+Tab',
    click() {
      activate('next-note');
    }
  }, {
    label: 'Navigate to Previous Note',
    accelerator: 'CmdorCtrl+Shift+Tab',
    click() {
      activate('previous-note');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Always on Top',
    type: 'checkbox',
    checked: config.get('alwaysOnTop'),
    accelerator: 'CmdorCtrl+Shift+P',
    click(item, focusedWindow) {
      config.set('alwaysOnTop', item.checked);
      focusedWindow.setAlwaysOnTop(item.checked);
    }
  }, {
    label: 'Hide Tray Icon',
    type: 'checkbox',
    checked: config.get('hideTray'),
    click(item) {
      config.set('hideTray', item.checked);
      app.relaunch();
      app.quit();
    }
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Menu Bar',
    type: 'checkbox',
    checked: config.get('menuBarVisible'),
    click() {
      activate('toggle-menu-bar');
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
  label: 'Format',
  submenu: [{
    label: 'Style',
    submenu: [{
      label: 'Bold text',
      accelerator: setAcc('bold', 'CmdorCtrl+B'),
      click() {
        activate('bold');
      }
    }, {
      label: 'Italic text',
      accelerator: setAcc('italic', 'CmdorCtrl+I'),
      click() {
        activate('italic');
      }
    }, {
      label: 'Underline text',
      accelerator: setAcc('underline', 'CmdorCtrl+U'),
      click() {
        activate('underline');
      }
    }, {
      label: 'Strikethrough text',
      accelerator: setAcc('strikethrough', 'CmdorCtrl+T'),
      click() {
        activate('strikethrough');
      }
    }]
  }, {
    label: 'Add link',
    accelerator: setAcc('add-link', 'CmdorCtrl+Shift+K'),
    click() {
      activate('add-link');
    }
  }, {
    label: 'Attach file',
    accelerator: setAcc('attach-file', 'CmdorCtrl+Shift+F'),
    click() {
      activate('attach-file');
    }
  }, {
    label: 'Insert from Drive',
    accelerator: setAcc('insert-drive', 'CmdorCtrl+Shift+D'),
    click() {
      activate('insert-drive');
    }
  }, {
    label: 'Paragraph',
    submenu: [{
      label: 'Align left',
      accelerator: setAcc('align-left', 'CmdorCtrl+Alt+L'),
      click() {
        activate('align-left');
      }
    }, {
      label: 'Align center',
      accelerator: setAcc('align-center', 'CmdorCtrl+Alt+M'),
      click() {
        activate('align-center');
      }
    }, {
      label: 'Align right',
      accelerator: setAcc('align-right', 'CmdorCtrl+Alt+R'),
      click() {
        activate('align-right');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Increase indentation',
      accelerator: setAcc('indent', 'CmdorCtrl+Alt+K'),
      click() {
        activate('indent');
      }
    }, {
      label: 'Decrease indentation',
      accelerator: setAcc('outdent', 'CmdorCtrl+Shift+M'),
      click() {
        activate('outdent');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Numbered list',
      accelerator: setAcc('numbered', 'CmdorCtrl+Shift+O'),
      click() {
        activate('numbered');
      }
    }, {
      label: 'Bulleted list',
      accelerator: setAcc('bulleted', 'CmdorCtrl+Shift+.'),
      click() {
        activate('bulleted');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Checkbox',
    accelerator: setAcc('checkbox', 'CmdorCtrl+Shift+C'),
    click() {
      activate('checkbox');
    }
  }, {
    label: 'Code block',
    accelerator: setAcc('code-block', 'CmdorCtrl+Shift+L'),
    click() {
      activate('code-block');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Subscript text',
    accelerator: setAcc('subscript', 'CmdorCtrl+Shift+]'),
    click() {
      activate('subscript');
    }
  }, {
    label: 'Superscript text',
    accelerator: setAcc('superscript', 'CmdorCtrl+Shift+['),
    click() {
      activate('superscript');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Remove Formatting',
    accelerator: setAcc('remove-formatting', 'CmdorCtrl+Shift+Space'),
    click() {
      activate('remove-formatting');
    }
  }, {
    label: 'Insert Horizontal Rule',
    accelerator: setAcc('horizontal-rule', 'CmdorCtrl+Shift+-'),
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
