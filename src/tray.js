'use strict';
const {app, Menu, shell, Tray} = require('electron');
const {is} = require('./util');
const dialog = require('./dialog');
const file = require('./file');
const settings = require('./settings');
const url = require('./url');
const win = require('./win');

let tray = null;

function create() {
  if (is.darwin || tray) {
    return;
  }

  const menu = Menu.buildFromTemplate([
    {
      label: 'Open Tusk',
      click() {
        win.toggle();
      }
    }, {
      type: 'separator'
    }, {
      label: 'Search',
      click() {
        win.appear();
        win.activate('search');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Create',
      submenu: [
        {
          label: 'New Tag',
          click() {
            win.appear();
            win.activate('new-tag');
          }
        }, {
          label: 'New Note',
          click() {
            win.appear();
            win.activate('new-note');
          }
        }, {
          label: 'New Notebook',
          click() {
            win.appear();
            win.activate('new-notebook');
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
          click() {
            win.appear();
            win.activate('toggle-sepia-mode');
          }
        }, {
          label: 'Dark Theme',
          click() {
            win.appear();
            win.activate('toggle-dark-mode');
          }
        }, {
          label: 'Black Theme',
          click() {
            win.appear();
            win.activate('toggle-black-mode');
          }
        }
      ]
    }, {
      label: 'Auto Night Mode',
      type: 'checkbox',
      checked: settings.get('autoNightMode'),
      click(item) {
        win.appear();
        settings.set('autoNightMode', item.checked);
        win.activate('auto-night-mode');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Evernote Settings',
      click() {
        shell.openExternal(url.settings);
      }
    }, {
      label: 'Report Issue',
      click() {
        shell.openExternal(url.issue);
      }
    }, {
      type: 'separator'
    }, {
      label: 'Exit',
      click() {
        dialog.confirmExit();
      }
    }
  ]);

  tray = new Tray(file.trayIcon);
  tray.setToolTip(`${app.getName()}`);
  tray.setContextMenu(menu);
  tray.on('click', win.toggle);
}

module.exports = {create};
