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
      enabled: !settings.get('disableAutoUpdateCheck'),
      submenu: [
        {
          label: 'Once Every 4 Hours',
          type: 'checkbox',
          checked: settings.get('updateCheckPeriod') === '4',
          click(item) {
            dialog.confirmActivationRestart('updateCheckPeriod', '4');
            item.checked = settings.get('updateCheckPeriod') === '4';
          }
        }, {
          label: 'Once Every 8 Hours',
          type: 'checkbox',
          checked: settings.get('updateCheckPeriod') === '8',
          click(item) {
            dialog.confirmActivationRestart('updateCheckPeriod', '8');
            item.checked = settings.get('updateCheckPeriod') === '8';
          }
        }, {
          label: 'Once Every 12 Hours',
          type: 'checkbox',
          checked: settings.get('updateCheckPeriod') === '12',
          click(item) {
            dialog.confirmActivationRestart('updateCheckPeriod', '12');
            item.checked = settings.get('updateCheckPeriod') === '12';
          }
        }, {
          label: 'Once a Day',
          type: 'checkbox',
          checked: settings.get('updateCheckPeriod') === '24',
          click(item) {
            dialog.confirmActivationRestart('updateCheckPeriod', '24');
            item.checked = settings.get('updateCheckPeriod') === '24';
          }
        }
      ]
    }, {
      label: 'Disable Automatic Update Check',
      type: 'checkbox',
      checked: settings.get('disableAutoUpdateCheck'),
      click(item) {
        dialog.confirmActivationRestart('disableAutoUpdateCheck', item.checked);
        item.checked = settings.get('disableAutoUpdateCheck');
      }
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
