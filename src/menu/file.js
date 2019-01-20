'use strict';
const {app, shell} = require('electron');
const {activate} = require('./../win');
const {is} = require('./../util');
const {setAcc} = require('./../keymap');
const dialog = require('./../dialog');
const file = require('./../file');
const settings = require('./../settings');
const url = require('./../url');

module.exports = {
  label: 'File',
  submenu: [
    {
      label: 'Search',
      accelerator: setAcc('search', 'CmdorCtrl+F'),
      click() {
        activate('search');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Create',
      submenu: [
        {
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
        }
      ]
    }, {
      type: 'separator'
    }, {
      label: 'Navigate',
      submenu: [
        {
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
        }
      ]
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
      submenu: [
        {
          label: 'PDF File',
          accelerator: setAcc('export-pdf', 'CmdorCtrl+Shift+E'),
          click() {
            activate('export');
          }
        }, {
          label: 'HTML File',
          accelerator: setAcc('export-html', 'CmdorCtrl+Shift+H'),
          click() {
            activate('export-as-html');
          }
        }, {
          label: 'Markdown File',
          accelerator: setAcc('export-markdown', 'CmdorCtrl+O'),
          click() {
            activate('export-as-markdown');
          }
        }
      ]
    }, {
      type: 'separator'
    }, {
      label: 'Evernote Settings',
      accelerator: setAcc('settings', 'CmdorCtrl+,'),
      click() {
        shell.openExternal(url.settings);
      }
    }, {
      label: 'Launch on Start',
      type: 'checkbox',
      checked: settings.get('autoLaunch'),
      click(item) {
        settings.set('autoLaunch', item.checked);
        activate('auto-launch');
      }
    }, {
      label: 'Launch Minimized',
      type: 'checkbox',
      checked: settings.get('launchMinimized'),
      click(item) {
        settings.set('launchMinimized', item.checked);
      }
    }, {
      type: 'separator'
    }, {
      label: 'Edit Shortcut Keys',
      accelerator: 'CmdorCtrl+.',
      click() {
        shell.openExternal(file.localConfig);
      }
    }, {
      label: 'Enable Global Shortcut Keys',
      type: 'checkbox',
      checked: settings.get('useGlobalShortcuts'),
      click(item) {
        dialog.confirmActivationRestart('useGlobalShortcuts', item.checked);
        item.checked = settings.get('useGlobalShortcuts');
      }
    }, {
      label: 'Request Exit Confirmation',
      type: 'checkbox',
      checked: settings.get('requestExitConfirmation'),
      click(item) {
        settings.set('requestExitConfirmation', item.checked);
      }
    }, {
      type: 'separator'
    }, {
      label: 'Switch to Yinxiang',
      visible: !settings.get('useYinxiang'),
      click() {
        settings.set('useYinxiang', true);
        app.relaunch();
        app.quit();
      }
    }, {
      label: 'Switch to Evernote',
      visible: settings.get('useYinxiang'),
      click() {
        settings.set('useYinxiang', false);
        app.relaunch();
        app.quit();
      }
    }, {
      type: 'separator'
    }, {
      label: 'Log Out',
      click() {
        dialog.confirmSignOut();
      }
    }, {
      label: 'Exit',
      visible: !is.darwin,
      click() {
        dialog.confirmExit();
      }
    }
  ]
};
