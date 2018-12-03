'use strict';
const path = require('path');
const fs = require('fs');
const electron = require('electron');
const os = require('os');
const isDevMode = require('electron-is-dev');
const ms = require('ms');
const timeStamp = require('time-stamp');
const decodeUri = require('decode-uri-component');
const appMenu = require('./src/menu');
const tray = require('./src/tray');
const config = require('./src/config');
const update = require('./src/update');

const {app, BrowserWindow, dialog, ipcMain, Menu, shell} = electron;
const {join} = path;

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

  const tuskWindow = new BrowserWindow({
    title: app.getName(),
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    minWidth: 400,
    minHeight: 200,
    icon: process.platform === 'linux' && join(__dirname, '../static/Icon.png'),
    alwaysOnTop: config.get('alwaysOnTop'),
    titleBarStyle: 'hiddenInset',
    darkTheme: darkModeFlag,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, 'src/browser.js'),
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

  tuskWindow.on('unresponsive', e => {
    console.log('Unresponsive Tusk window. ', e);
  });

  tuskWindow.webContents.on('did-navigate-in-page', (e, url) => {
    config.set('lastURL', url);
  });

  return tuskWindow;
}

app.on('ready', () => {
  Menu.setApplicationMenu(appMenu);
  mainWindow = createMainWindow();
  if (config.get('useGlobalShortcuts')) {
    appMenu.registerGlobalShortcuts();
  }
  if (!config.get('hideTray')) {
    tray.create(mainWindow);
  }
  const windowContent = mainWindow.webContents;

  windowContent.on('dom-ready', () => {
    windowContent.insertCSS(fs.readFileSync(join(__dirname, 'src/style/browser.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(join(__dirname, 'src/style/dark-mode.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(join(__dirname, 'src/style/black-mode.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(join(__dirname, 'src/style/sepia-mode.css'), 'utf8'));

    if (config.get('launchMinimized')) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  windowContent.on('new-window', (e, url) => {
    e.preventDefault();
    const prefix = 'https://www.evernote.com/OutboundRedirect.action?dest=';
    url = decodeUri(url.replace(prefix, ''));
    if (url.split('/', 4).includes('shard')) {
      windowContent.downloadURL(url);
    } else {
      shell.openExternal(url);
    }
  });

  windowContent.on('crashed', e => {
    console.log('Tusk window crashed. ', e);
  });

  update.init(Menu.getApplicationMenu());

  if (!isDevMode) {
    setInterval(() => {
      update.autoUpdateCheck();
    }, ms(config.get('updateCheckPeriod')));
  }
});

ipcMain.on('activate-menu-bar', () => {
  if (config.get('menuBarHidden')) {
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);
  } else {
    mainWindow.setMenuBarVisibility(true);
    mainWindow.setAutoHideMenuBar(false);
  }
});

ipcMain.on('print-to-pdf', event => {
  const dateTime = timeStamp('YYYY-MM-DD_HH-mm-ss');
  const tmpDir = os.tmpdir();
  const fileName = 'Tusk_Note_' + dateTime + '.pdf';
  console.log('Date - time: ' + dateTime);
  console.log('Temp directory: ' + tmpDir);
  console.log('File to be printed: ' + fileName);
  const filePath = join(tmpDir, fileName);
  const noteWindow = BrowserWindow.fromWebContents(event.sender);
  noteWindow.webContents.printToPDF({}, (error, data) => {
    if (error) {
      return console.log(error.message);
    }
    fs.writeFile(filePath, data, err => {
      if (err) {
        return console.log(err.message);
      }
      shell.openExternal('file://' + filePath);
    });
  });
});

ipcMain.on('export-as-pdf', event => {
  const removeString = ' | Evernote Web';
  const noteTitle = mainWindow.webContents.getTitle().replace(removeString, '');
  console.log('Note to be exported is titled: ' + noteTitle);
  const noteWindow = BrowserWindow.fromWebContents(event.sender);
  const options = {
    defaultPath: noteTitle,
    filters: [{
      name: 'PDF File',
      extensions: ['pdf']
    }, {
      name: 'All Files',
      extensions: ['*']
    }]
  };
  noteWindow.webContents.printToPDF({}, (error, data) => {
    if (error) {
      return console.log(error.message);
    }
    dialog.showSaveDialog(options, fileName => {
      if (fileName === undefined) {
        return console.log('Note was not exported');
      }
      fs.writeFile(fileName, data, err => {
        if (err) {
          dialog.showErrorBox('Exporting note error', err.message);
          return console.log(err.message);
        }
      });
    });
  });
});

process.on('uncaughtException', error => {
  console.log(error);
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
