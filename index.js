'use strict';
const path = require('path');
const fs = require('fs');
const electron = require('electron');
const os = require('os');
const isDevMode = require('electron-is-dev');
const ms = require('ms');
const timeStamp = require('time-stamp');
const decodeUri = require('decode-uri-component');
const appMenu = require('./menu');
const tray = require('./tray');
const config = require('./config');
const update = require('./update');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const shell = electron.shell;
const dialog = electron.dialog;

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

  tuskWindow.on('unresponsive', e => {
    console.log('Unresponsive Tusk window. ', e);
  });

  tuskWindow.webContents.on('did-navigate-in-page', (e, url) => {
    config.set('lastURL', url);
  });

  return tuskWindow;
}

app.on('ready', () => {
  electron.Menu.setApplicationMenu(appMenu);
  mainWindow = createMainWindow();
  if (config.get('useGlobalShortcuts')) {
    // Check whether the global shortcuts should be activated
    appMenu.registerGlobalShortcuts();
  }
  if (!config.get('hideTray')) {
    // Check whether the tray icon should be activated
    tray.create(mainWindow);
  }
  const windowContent = mainWindow.webContents;

  windowContent.on('dom-ready', () => {
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'style/browser.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'style/dark-mode.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'style/black-mode.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'style/sepia-mode.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'style/vibrant-mode.css'), 'utf8'));
    windowContent.insertCSS(fs.readFileSync(path.join(__dirname, 'style/vibrant-dark-mode.css'), 'utf8'));

    if (config.get('launchMinimized')) {
      // Check whether to launch the main window minimized
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  windowContent.on('new-window', (e, url) => {
    e.preventDefault();
    // Workaround for managing external links
    const prefix = 'https://www.evernote.com/OutboundRedirect.action?dest=';
    // Remove prefix & decode URL
    url = decodeUri(url.replace(prefix, ''));
    // Determine URL type
    if (url.split('/', 4).includes('shard')) {
      windowContent.downloadURL(url); // Initialize file download
    } else {
      electron.shell.openExternal(url); // Open external link in browser
    }
  });

  windowContent.on('crashed', e => {
    console.log('Tusk window crashed. ', e);
  });

  update.init(electron.Menu.getApplicationMenu());

  if (!isDevMode) {
    setInterval(() => {
      update.autoUpdateCheck();
    }, ms(config.get('updateCheckPeriod')));
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

ipcMain.on('activate-menu-bar', () => {
  // Check if the menu bar was activated
  if (config.get('menuBarHidden')) {
    // Hide the menu bar
    mainWindow.setMenuBarVisibility(false);
    // Restore ALT key toggling
    mainWindow.setAutoHideMenuBar(true);
  } else {
    // Make the menu bar persistently visible
    mainWindow.setMenuBarVisibility(true);
    // Disable ALT key toggling
    mainWindow.setAutoHideMenuBar(false);
  }
});

ipcMain.on('print-to-pdf', event => {
  // Get the current date-time
  const dateTime = timeStamp('YYYY-MM-DD_HH-mm-ss');
  const tmpDir = os.tmpdir();
  // Construct the filename using the current date-time
  const fileName = 'Tusk_Note_' + dateTime + '.pdf';
  console.log('Date - time: ' + dateTime);
  console.log('Temp directory: ' + tmpDir);
  console.log('File to be printed: ' + fileName);
  // Path of the file to be printed
  const filePath = path.join(tmpDir, fileName);
  // Get the window with the note that is to be printed
  const noteWindow = BrowserWindow.fromWebContents(event.sender);
  // Initialize printing process
  noteWindow.webContents.printToPDF({}, (error, data) => {
    if (error) {
      return console.log(error.message);
    }
    // Write the pdf file to file path
    fs.writeFile(filePath, data, err => {
      if (err) {
        return console.log(err.message);
      }
      // Open the pdf file to be printed
      shell.openExternal('file://' + filePath);
    });
  });
});

ipcMain.on('export-as-pdf', event => {
  // String to be removed from note title
  const removeString = ' | Evernote Web';
  // Get the note title
  const noteTitle = mainWindow.webContents.getTitle().replace(removeString, '');
  console.log('Note to be exported is titled: ' + noteTitle);
  const noteWindow = BrowserWindow.fromWebContents(event.sender);
  // `Save note` dialog options
  const options = {
    // Suggest note title as filename
    defaultPath: noteTitle,
    filters: [{
      name: 'PDF File',
      extensions: ['pdf']
    }, {
      name: 'All Files',
      extensions: ['*']
    }]
  };
  // Initialize printing process
  noteWindow.webContents.printToPDF({}, (error, data) => {
    if (error) {
      return console.log(error.message);
    }
    // Set out the `Save note` dialog
    dialog.showSaveDialog(options, fileName => {
      // Check if the filepath is valid
      if (fileName === undefined) {
        return console.log('Note was not exported');
      }
      // Initialize the file writing process
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
  // Report uncaught exceptions
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
