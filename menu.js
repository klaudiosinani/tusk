'use strict';
const os = require('os');
const path = require('path');
const electron = require('electron');
const fs = require('fs-extra');
const timeStamp = require('time-stamp');
const config = require('./config');
const update = require('./update');

const join = path.join;
const app = electron.app;
const resolve = path.resolve;
const shell = electron.shell;
const appName = app.getName();
const dialog = electron.dialog;
const platform = process.platform;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

let configData;
let defaultConfigPath; // Path to the default config file
const homeDir = os.homedir();
const tuskJSON = '.tusk.json'; // Config file name on the home directory
const homeConfig = join(homeDir, tuskJSON); // Path to the config file on the home directory
const keymapsDir = resolve(__dirname, 'keymaps'); // Keymaps directory

const sourceURL = 'https://github.com/klauscfhq/tusk';
const homepageURL = 'https://klauscfhq.github.io/tusk';
const communityURL = 'https://gitter.im/klauscfhq/tusk';
const issueURL = 'https://github.com/klauscfhq/tusk/issues/new';
const searchURL = 'https://github.com/search?q=+is:issue+repo:klauscfhq/tusk';
const licenseURL = 'https://github.com/klauscfhq/tusk/blob/master/license.md';
const keyboardShortcutsRefURL = 'https://github.com/klauscfhq/tusk#keyboard-shortcuts';
const searchFeatureRequestsURL = 'https://github.com/klauscfhq/tusk/labels/feature-request';

function activate(command) {
  const [appWindow] = BrowserWindow.getAllWindows();

  if (process.platform === 'darwin') {
    appWindow.restore();
  }

  appWindow.webContents.send(command);
}

function getPath() {
  // Retrieve the default path of the platform-dedicated config file
  switch (platform) {
    case ('darwin'):
      defaultConfigPath = join(keymapsDir, 'darwin.json');
      break;

    case ('linux'):
      defaultConfigPath = join(keymapsDir, 'linux.json');
      break;

    case ('win32'):
      defaultConfigPath = join(keymapsDir, 'win32.json');
      break;

    default:
      defaultConfigPath = join(keymapsDir, 'linux.json');
      break;
  }
  return defaultConfigPath;
}

function getConfig() {
  // Get the dedicated config file for each platform
  const defaultConfig = getPath();
  // Create a new default config file if it does not already exist
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

function setAcc(custom, predefined) {
  // Return the custom or predefined shortcut keys
  if (Object.prototype.hasOwnProperty.call(tuskConfig.shortcutKeys, custom)) {
    return tuskConfig.shortcutKeys[custom];
  }
  return predefined;
}

function showWin() {
  // Bring main app window on top if not visible or focused
  const appWindow = BrowserWindow.getAllWindows()[0];
  if (!appWindow.isVisible() || !appWindow.isFocused()) {
    appWindow.show();
    appWindow.focus();
  }
}

function toggleWin() {
  // Toggle/untoggle main app window
  const appWindow = BrowserWindow.getAllWindows()[0];
  if (appWindow.isVisible() && appWindow.isFocused()) {
    appWindow.hide();
    appWindow.blur();
  } else {
    appWindow.show();
    appWindow.focus();
  }
}

function registerGlobalShortcuts() {
  const globalToggleTusk = globalShortcut.register(
    // Global shortcut key for toggling/untoggling main app window
    setAcc('global-toggle-tusk', 'Shift+Alt+A'), () => {
      toggleWin();
    });

  const globalSearchNote = globalShortcut.register(
    // Global shortcut key for note searching
    setAcc('global-search', 'Shift+Alt+F'), () => {
      showWin();
      activate('search');
    });

  const globalCreateNote = globalShortcut.register(
    // Global shortcut key for note creation
    setAcc('global-new-note', 'Shift+Alt+C'), () => {
      showWin();
      activate('new-note');
    });

  if (globalToggleTusk && globalSearchNote && globalCreateNote) {
    console.log('Successfully registered global shortcut keys');
  } else {
    console.log('Global shortcut keys registration failed');
  }
}

function confirmLogOut() {
  const logOut = () => {
    // Display log-out confirmation dialog
    const response = dialog.showMessageBox({
      icon: path.join(__dirname, 'static/Icon.png'),
      title: 'Log Out Confirmation',
      message: 'Log Out of Tusk',
      detail: 'Are you sure you want to log out?',
      buttons: ['Log Out', 'Dismiss'],
      defaultId: 0, // Make `Log Out` the default action button
      cancelId: 1
    });
    return (response === 0);
  };
  // Check whether the log-out button was pressed
  if (logOut()) {
    activate('log-out');
  }
}

function requestAppRestart() {
  const restart = () => {
    // Display restart confirmation dialog on settings update
    const response = dialog.showMessageBox({
      icon: path.join(__dirname, 'static/Icon.png'),
      title: 'Restart Required',
      message: 'Restart Tusk to Activate New Settings',
      detail: 'Would you like to restart now?',
      buttons: ['Restart', 'Dismiss'],
      defaultId: 0, // Make `Restart` the default action button
      cancelId: 1
    });
    return (response === 0);
  };
  // Check whether the restart button was pressed
  if (restart()) {
    app.quit();
    app.relaunch();
  }
}

const helpSubmenu = [{
  label: `View License`,
  click() {
    shell.openExternal(licenseURL);
  }
}, {
  label: 'Version ' + app.getVersion(),
  enabled: false
}, {
  label: `Tusk Homepage`,
  click() {
    shell.openExternal(homepageURL);
  }
}, {
  label: `Check for Update`,
  click() {
    update.manualUpdateCheck();
  }
}, {
  label: `Update Check Frequency`,
  submenu: [{
    label: 'Once Every 2 Hours',
    type: 'checkbox',
    checked: (config.get('updateCheckPeriod') === '2h'),
    click() {
      config.set('updateCheckPeriod', '2h');
      requestAppRestart();
    }
  }, {
    label: 'Once Every 6 Hours',
    type: 'checkbox',
    checked: (config.get('updateCheckPeriod') === '6h'),
    click() {
      config.set('updateCheckPeriod', '6h');
      requestAppRestart();
    }
  }, {
    label: 'Once Every 12 Hours',
    type: 'checkbox',
    checked: (config.get('updateCheckPeriod') === '12h'),
    click() {
      config.set('updateCheckPeriod', '12h');
      requestAppRestart();
    }
  }, {
    label: 'Once a Day',
    type: 'checkbox',
    checked: (config.get('updateCheckPeriod') === '24h'),
    click() {
      config.set('updateCheckPeriod', '24h');
      requestAppRestart();
    }
  }]
}, {
  type: 'separator'
}, {
  label: 'Keyboard Shortcuts Reference',
  click() {
    shell.openExternal(keyboardShortcutsRefURL);
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
  label: `Search Issues`,
  click() {
    shell.openExternal(searchURL);
  }
}, {
  label: `Search Feature Requests`,
  click() {
    shell.openExternal(searchFeatureRequestsURL);
  }
}, {
  label: `Community Discussion`,
  click() {
    shell.openExternal(communityURL);
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
        message: `Tusk ${app.getVersion()} (${os.arch()})`,
        detail: 'Created by Klaus Sinani',
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
    label: 'Export Note as',
    submenu: [{
      label: 'PDF File',
      accelerator: setAcc('export-pdf', 'CmdorCtrl+Shift+E'),
      click() {
        activate('export');
      }
    }, {
      label: 'Markdown File',
      accelerator: setAcc('export-markdown', 'CmdorCtrl+O'),
      click() {
        activate('export-as-markdown');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Evernote Settings',
    accelerator: setAcc('settings', 'CmdorCtrl+,'),
    click() {
      activate('settings');
    }
  }, {
    label: 'Launch on Start',
    type: 'checkbox',
    checked: config.get('autoLaunch'),
    click(item) {
      config.set('autoLaunch', item.checked);
      activate('auto-launch');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Edit Shortcut Keys',
    accelerator: 'CmdorCtrl+.',
    click() {
      activate('edit-shortcuts');
    }
  }, {
    label: 'Enable Global Shortcut Keys',
    type: 'checkbox',
    checked: config.get('useGlobalShortcuts'),
    click(item) {
      config.set('useGlobalShortcuts', item.checked);
      requestAppRestart();
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
    label: 'Log Out',
    click() {
      confirmLogOut();
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
    label: 'Toggle Side Bar',
    type: 'checkbox',
    checked: !config.get('sideBarHidden'),
    accelerator: setAcc('toggle-sidebar', 'CmdorCtrl+\\'),
    click() {
      activate('toggle-side-bar');
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
    label: 'Toggle Focus Mode',
    accelerator: setAcc('toggle-focus-mode', 'CmdOrCtrl+K'),
    click() {
      activate('focus-mode');
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
    label: 'Font Size',
    submenu: [{
      label: 'Header 1',
      accelerator: 'Alt+CmdorCtrl+1',
      click() {
        activate('header-one');
      }
    }, {
      label: 'Header 2',
      accelerator: 'Alt+CmdorCtrl+2',
      click() {
        activate('header-two');
      }
    }, {
      label: 'Header 3',
      accelerator: 'Alt+CmdorCtrl+3',
      click() {
        activate('header-three');
      }
    }, {
      label: 'Header 4',
      accelerator: 'Alt+CmdorCtrl+4',
      click() {
        activate('header-four');
      }
    }, {
      label: 'Header 5',
      accelerator: 'Alt+CmdorCtrl+5',
      click() {
        activate('header-five');
      }
    }, {
      label: 'Header 6',
      accelerator: 'Alt+CmdorCtrl+6',
      click() {
        activate('header-six');
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
    label: 'Insert Date Stamp',
    accelerator: setAcc('date-stamp', 'CmdOrCtrl+Shift+;'),
    click() {
      const dateStamp = timeStamp('MM/DD/YYYY');
      const appWindow = BrowserWindow.getAllWindows()[0];
      appWindow.webContents.insertText(dateStamp);
    }
  }, {
    label: 'Insert Date-Time Stamp',
    accelerator: setAcc('date-time-stamp', 'CmdOrCtrl+;'),
    click() {
      const dateTimeStamp = timeStamp('MM/DD/YYYY HH:mm');
      const appWindow = BrowserWindow.getAllWindows()[0];
      appWindow.webContents.insertText(dateTimeStamp);
    }
  }, {
    type: 'separator'
  }, {
    label: 'Checkbox',
    accelerator: setAcc('checkbox', 'CmdorCtrl+Shift+B'),
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
    label: 'Export Note as',
    submenu: [{
      label: 'PDF File',
      accelerator: setAcc('export-pdf', 'CmdorCtrl+Shift+E'),
      click() {
        activate('export');
      }
    }, {
      label: 'Markdown File',
      accelerator: setAcc('export-markdown', 'CmdorCtrl+O'),
      click() {
        activate('export-as-markdown');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Evernote Settings',
    accelerator: setAcc('settings', 'CmdorCtrl+,'),
    click() {
      activate('settings');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Launch on Start',
    type: 'checkbox',
    checked: config.get('autoLaunch'),
    click(item) {
      config.set('autoLaunch', item.checked);
      activate('auto-launch');
    }
  }, {
    label: 'Launch Minimized',
    type: 'checkbox',
    checked: config.get('launchMinimized'),
    click(item) {
      config.set('launchMinimized', item.checked);
    }
  }, {
    type: 'separator'
  }, {
    label: 'Edit Shortcut Keys',
    accelerator: 'CmdorCtrl+.',
    click() {
      activate('edit-shortcuts');
    }
  }, {
    label: 'Enable Global Shortcut Keys',
    type: 'checkbox',
    checked: config.get('useGlobalShortcuts'),
    click(item) {
      config.set('useGlobalShortcuts', item.checked);
      requestAppRestart();
    }
  }, {
    type: 'separator'
  }, {
    label: 'Switch to Yinxiang',
    visible: !config.get('useYinxiang'),
    click() {
      config.set('useYinxiang', true);
      requestAppRestart();
    }
  }, {
    label: 'Switch to Evernote',
    visible: config.get('useYinxiang'),
    click() {
      config.set('useYinxiang', false);
      requestAppRestart();
    }
  }, {
    type: 'separator'
  }, {
    label: 'Log Out',
    click() {
      confirmLogOut();
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
      requestAppRestart();
    }
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Side Bar',
    type: 'checkbox',
    checked: !config.get('sideBarHidden'),
    accelerator: setAcc('toggle-sidebar', 'CmdorCtrl+\\'),
    click() {
      activate('toggle-side-bar');
    }
  }, {
    label: 'Toggle Menu Bar',
    type: 'checkbox',
    checked: !config.get('menuBarHidden'),
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
    label: 'Toggle Focus Mode',
    accelerator: setAcc('toggle-focus-mode', 'CmdOrCtrl+K'),
    click() {
      activate('focus-mode');
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
    label: 'Font Size',
    submenu: [{
      label: 'Header 1',
      accelerator: 'Alt+CmdorCtrl+1',
      click() {
        activate('header-one');
      }
    }, {
      label: 'Header 2',
      accelerator: 'Alt+CmdorCtrl+2',
      click() {
        activate('header-two');
      }
    }, {
      label: 'Header 3',
      accelerator: 'Alt+CmdorCtrl+3',
      click() {
        activate('header-three');
      }
    }, {
      label: 'Header 4',
      accelerator: 'Alt+CmdorCtrl+4',
      click() {
        activate('header-four');
      }
    }, {
      label: 'Header 5',
      accelerator: 'Alt+CmdorCtrl+5',
      click() {
        activate('header-five');
      }
    }, {
      label: 'Header 6',
      accelerator: 'Alt+CmdorCtrl+6',
      click() {
        activate('header-six');
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
    label: 'Insert Date Stamp',
    accelerator: setAcc('date-stamp', 'CmdOrCtrl+Shift+;'),
    click() {
      const dateStamp = timeStamp('MM/DD/YYYY');
      const appWindow = BrowserWindow.getAllWindows()[0];
      appWindow.webContents.insertText(dateStamp);
    }
  }, {
    label: 'Insert Date-Time Stamp',
    accelerator: setAcc('date-time-stamp', 'CmdOrCtrl+;'),
    click() {
      const dateTimeStamp = timeStamp('MM/DD/YYYY HH:mm');
      const appWindow = BrowserWindow.getAllWindows()[0];
      appWindow.webContents.insertText(dateTimeStamp);
    }
  }, {
    type: 'separator'
  }, {
    label: 'Checkbox',
    accelerator: setAcc('checkbox', 'CmdorCtrl+Shift+B'),
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

module.exports.registerGlobalShortcuts = registerGlobalShortcuts;
