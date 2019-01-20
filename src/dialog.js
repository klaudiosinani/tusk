'use strict';
const {app, clipboard, dialog, shell} = require('electron');
const os = require('os');
const {activate} = require('./win');
const {release} = require('./url');
const file = require('./file');
const settings = require('./settings');

class Dialog {
  get _systemInfo() {
    return [
      `Version: ${app.getVersion()}`,
      `Electron: ${process.versions.electron}`,
      `Chrome: ${process.versions.chrome}`,
      `Node: ${process.versions.node}`,
      `V8: ${process.versions.v8}`,
      `OS: ${os.type()} ${os.arch()} ${os.release()}`
    ].join('\n');
  }

  _about() {
    return this._create({
      buttons: ['Done', 'Copy'],
      detail: `Created by Klaus Sinani.\n\n${this._systemInfo}`,
      message: `Tusk ${app.getVersion()} (${os.arch()})`,
      title: 'About Tusk'
    });
  }

  _create(options) {
    return dialog.showMessageBox(
      Object.assign({
        cancelId: 1,
        defaultId: 0,
        icon: file.icon
      }, options)
    );
  }

  _exit() {
    return this._create({
      buttons: ['Exit', 'Dismiss'],
      detail: 'Are you sure you want to exit?',
      message: 'Exit Tusk',
      title: 'Tusk - Exit Confirmation'
    });
  }

  _signOut() {
    return this._create({
      buttons: ['Sign Out', 'Dismiss'],
      detail: 'Are you sure you want to sign out?',
      message: 'Sign out of Tusk',
      title: 'Tusk - Sign Out Confirmation'
    });
  }

  _restart() {
    return this._create({
      buttons: ['Restart', 'Dismiss'],
      detail: 'Would you like to restart now?',
      message: 'Restart Tusk to activate your new settings',
      title: 'Tusk - Restart Required'
    });
  }

  _update(version) {
    return this._create({
      buttons: ['Download', 'Dismiss'],
      detail: 'Click Download to get it now',
      message: `Version ${version} is now available`,
      title: 'Update Tusk'
    });
  }

  confirmAbout() {
    if (this._about() === 1) {
      clipboard.writeText(this._systemInfo);
    }
  }

  confirmExit() {
    if (settings.get('requestExitConfirmation')) {
      if (this._exit() === 0) {
        app.quit();
      }
    } else {
      app.quit();
    }
  }

  confirmActivationRestart(option, state) {
    if (this._restart() === 0) {
      settings.set(option, state);
      app.quit();
      app.relaunch();
    }
  }

  confirmSignOut() {
    if (this._signOut() === 0) {
      activate('log-out');
    }
  }

  updateError(content) {
    return dialog.showErrorBox('Request to get update failed', content);
  }

  noUpdate() {
    return this._create({
      detail: `Tusk is running on the latest ${app.getVersion()} version`,
      message: 'There are currently no updates available',
      title: 'Tusk - No Update Available',
      buttons: ['Done']
    });
  }

  getUpdate(version) {
    if (this._update(version) === 0) {
      shell.openExternal(release);
    }
  }
}

module.exports = new Dialog();
