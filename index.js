'use strict';
const path = require('path');
const fs = require('fs');
const electron = require('electron');
const isDevMode = require('electron-is-dev');
const ms = require('ms');
const appMenu = require('./menu');
const tray = require('./tray');
const config = require('./config');
const update = require('./update');

const app = electron.app;
const ipcMain = electron.ipcMain;

require('electron-debug')({enabled: true});
require('electron-dl')();
require('electron-context-menu')();

let mainWindow;
let exiting = false;
const yinxiangURL = 'https://app.yinxiang.com/Login.action';
const evernoteURL = 'https://www.evernote.com/Login.action';

const functioning = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
  }
});

if (functioning) {
  app.quit();
}

function createMainWindow() {
  const lastWindowState = config.get('lastWindowState');
  const maxWindowInteger = 2147483647;
  const darkModeFlag = config.get('darkMode') || config.get('blackMode');
  const lastURL = config.get('useYinxiang') ? yinxiangURL : evernoteURL;

  const tuskWindow = new electron.BrowserWindow({
    title: app.getName(),
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    minWidth: 400,
    minHeight: 200,
    icon: process.platform === 'linux' && path.join(__dirname, 'static/Icon.png'),
    alwaysOnTop: config.get('alwaysOnTop'),
    titleBarStyle: 'hiddenInset',
    darkTheme: darkModeFlag,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'browser.js'),
      nodeIntegration: false,
      plugins: true
    }
  });

  tuskWindow.loadURL(lastURL);

  tuskWindow.on('close', e => {
    if (!exiting) {
      e.preventDefault();

      if (process.platform === 'darwin') {
        app.hide();
      } else {
        tuskWindow.hide();
      }
    }
  });

  tuskWindow.on('enter-full-screen', () => {
    tuskWindow.setMaximumSize(maxWindowInteger, maxWindowInteger);
  });

  tuskWindow.on('page-title-updated', e => {
    e.preventDefault();
  });

  tuskWindow.webContents.on('did-navigate-in-page', (e, url) => {
    config.set('lastURL', url);
  });

  require('devtron').install();

  return tuskWindow;
}

app.on('ready', () => {
  electron.Menu.setApplicationMenu(appMenu);
  mainWindow = createMainWindow();
  tray.create(mainWindow);
  const windowContent = mainWindow.webContents;

  windowContent.on('dom-ready', () => {
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'dark-mode.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'black-mode.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'sepia-mode.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'vibrant-mode.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'vibrant-dark-mode.css'), 'utf8'));
    mainWindow.show();
  });

  windowContent.on('new-window', (e, url) => {
    e.preventDefault();
    electron.shell.openExternal(url);
  });

  update.init(electron.Menu.getApplicationMenu());

  if (!isDevMode) {
    setTimeout(() => {
      update.checkUpdate();
    }, ms('2m'));
  }
});

ipcMain.on('activate-vibrant', () => {
  // Check if the vibrant theme was activated
  if (config.get('vibrantMode')) {
    // Set the app's background vibrant light
    mainWindow.setVibrancy('light');
  } else if (config.get('vibrantDarkMode')) {
    // Set the app's background vibrant ultra dark
    mainWindow.setVibrancy('ultra-dark');
  } else {
    // Remove background vibrancy
    mainWindow.setVibrancy(null);
  }
});

app.on('activate', () => {
  mainWindow.show();
});

app.on('before-quit', () => {
  exiting = true;

  if (!mainWindow.isFullScreen()) {
    config.set('lastWindowState', mainWindow.getBounds());
  }
});
