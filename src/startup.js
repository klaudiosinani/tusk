'use strict';
const electron = require('electron');
const AutoLaunch = require('auto-launch');

const {app} = electron;

const launchTusk = new AutoLaunch({
  name: 'Tusk',
  path: (process.platform === 'darwin') ? app.getPath('exe').replace(/\.app\/Content.*/, '.app') : undefined,
  isHidden: true
});

function activate() {
  return launchTusk
    .isEnabled()
    .then(enabled => {
      if (!enabled) {
        return launchTusk.enable();
      }
    });
}

function deactivate() {
  return launchTusk
    .isEnabled()
    .then(enabled => {
      if (enabled) {
        return launchTusk.disable();
      }
    });
}

module.exports = {activate, deactivate};
