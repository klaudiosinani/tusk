'use strict';
const {app, BrowserWindow} = require('electron');
const {join} = require('path');
const {is} = require('./util');
const file = require('./file');
const settings = require('./settings');

class Win {
  get defaultOpts() {
    return {
      alwaysOnTop: settings.get('alwaysOnTop'),
      autoHideMenuBar: settings.get('menuBarHidden'),
      darkTheme: settings.get('mode.dark') || settings.get('mode.black'),
      icon: is.linux && file.icon,
      minHeight: 200,
      minWidth: 400,
      show: false,
      title: app.getName(),
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        nodeIntegration: false,
        plugins: true,
        preload: join(__dirname, './browser.js')
      }
    };
  }

  activate(command) {
    const [win] = BrowserWindow.getAllWindows();

    if (is.darwin) {
      win.restore();
    }

    win.webContents.send(command);
  }

  appear() {
    const [win] = BrowserWindow.getAllWindows();
    if (!win.isVisible()) {
      win.show();
      win.focus();
    }
  }

  toggle() {
    const [win] = BrowserWindow.getAllWindows();
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
      win.focus();
    }
  }
}

module.exports = new Win();
