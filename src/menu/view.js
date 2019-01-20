'use strict';
const {activate} = require('./../win');
const {is} = require('./../util');
const {setAcc} = require('./../keymap');
const dialog = require('./../dialog');
const settings = require('./../settings');

module.exports = {
  label: 'View',
  submenu: [
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+Shift+R',
      click: (_, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.reload();
        }
      }
    }, {
      type: 'separator'
    }, {
      label: 'Font Size Options',
      submenu: [
        {
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
        }
      ]
    }, {
      type: 'separator'
    }, {
      label: 'Toggle Theme',
      submenu: [
        {
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
        }
      ]
    }, {
      label: 'Auto Night Mode',
      type: 'checkbox',
      checked: settings.get('autoNightMode'),
      accelerator: 'CmdorCtrl+Alt+N',
      click(item) {
        settings.set('autoNightMode', item.checked);
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
      checked: settings.get('alwaysOnTop'),
      accelerator: 'CmdorCtrl+Shift+P',
      click(item, focusedWindow) {
        settings.set('alwaysOnTop', item.checked);
        focusedWindow.setAlwaysOnTop(item.checked);
      }
    }, {
      label: 'Hide Tray Icon',
      type: 'checkbox',
      visible: !is.darwin,
      checked: settings.get('hideTray'),
      click(item) {
        dialog.confirmActivationRestart('hideTray', item.checked);
        item.checked = settings.get('hideTray');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Toggle Side Bar',
      type: 'checkbox',
      checked: !settings.get('sideBarHidden'),
      accelerator: setAcc('toggle-sidebar', 'CmdorCtrl+\\'),
      click() {
        activate('toggle-side-bar');
      }
    }, {
      label: 'Toggle Menu Bar',
      type: 'checkbox',
      checked: !settings.get('menuBarHidden'),
      visible: !is.darwin,
      click(item, focusedWindow) {
        settings.set('menuBarHidden', !item.checked);
        focusedWindow.setMenuBarVisibility(item.checked);
        focusedWindow.setAutoHideMenuBar(!item.checked);
      }
    }, {
      label: 'Toggle Focus Mode',
      accelerator: setAcc('toggle-focus-mode', 'CmdOrCtrl+K'),
      click() {
        activate('focus-mode');
      }
    }, {
      label: 'Toggle Full Screen',
      accelerator: is.darwin ? 'Ctrl+Command+F' : 'F11',
      click: (_, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          focusedWindow.send('window:fullscreen', {state: focusedWindow.isFullScreen()});
        }
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: is.darwin ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click: (_, focusedWindow) => {
        focusedWindow.toggleDevTools();
      }
    }
  ]
};
