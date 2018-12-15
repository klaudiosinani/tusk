'use strict';
const {app, shell} = require('electron');
const dialog = require('./../dialog');
const settings = require('./../settings');
const update = require('./../update');
const url = require('./../url');

module.exports = {
  label: 'Help',
  submenu: [
    {
      label: 'View License',
      click() {
        shell.openExternal(url.license);
      }
    }, {
      label: `Version ${app.getVersion()}`,
      enabled: false
    }, {
      label: 'Tusk Homepage',
      click() {
        shell.openExternal(url.homepage);
      }
    }, {
      label: 'Check for Update',
      click() {
        update.check();
      }
    }, {
      label: 'Update Check Frequency',
      submenu: [
        {
          label: 'Once Every 4 Hours',
          type: 'checkbox',
          checked: (settings.get('updateCheckPeriod') === '4'),
          click() {
            settings.set('updateCheckPeriod', '4');
            dialog.confirmRestart();
          }
        }, {
          label: 'Once Every 8 Hours',
          type: 'checkbox',
          checked: (settings.get('updateCheckPeriod') === '8'),
          click() {
            settings.set('updateCheckPeriod', '8');
            dialog.confirmRestart();
          }
        }, {
          label: 'Once Every 12 Hours',
          type: 'checkbox',
          checked: (settings.get('updateCheckPeriod') === '12'),
          click() {
            settings.set('updateCheckPeriod', '12');
            dialog.confirmRestart();
          }
        }, {
          label: 'Once a Day',
          type: 'checkbox',
          checked: (settings.get('updateCheckPeriod') === '24'),
          click() {
            settings.set('updateCheckPeriod', '24');
            dialog.confirmRestart();
          }
        }
      ]
    }, {
      type: 'separator'
    }, {
      label: 'Keyboard Shortcuts Reference',
      click() {
        shell.openExternal(url.keyboardShortcutsRef);
      }
    }, {
      type: 'separator'
    }, {
      label: 'Fork Source',
      click() {
        shell.openExternal(url.source);
      }
    }, {
      label: 'Report Issue',
      click() {
        shell.openExternal(url.issue);
      }
    }, {
      label: 'Search Issues',
      click() {
        shell.openExternal(url.search);
      }
    }, {
      label: 'Search Feature Requests',
      click() {
        shell.openExternal(url.searchFeatureRequests);
      }
    }, {
      label: 'Community Discussion',
      click() {
        shell.openExternal(url.community);
      }
    }, {
      type: 'separator'
    }, {
      role: 'about',
      click() {
        dialog.confirmAbout();
      }
    }
  ]
};
