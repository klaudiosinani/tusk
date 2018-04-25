'use strict';
const fs = require('fs-extra');
const settings = require('electron-settings');

// Ensure creation of `Settings` file on startup
fs.ensureFileSync(settings.file());

settings.setAll({
  zoomFactor: settings.get('zoomFactor', 1),
  lastWindowState: {
    x: settings.get('lastWindowState.x'),
    y: settings.get('lastWindowState.y'),
    width: settings.get('lastWindowState.width', 900),
    height: settings.get('lastWindowState.height', 500)
  },
  menuBarHidden: settings.get('menuBarHidden', false),
  sideBarHidden: settings.get('sideBarHidden', false),
  launchMinimized: settings.get('launchMinimized', false),
  autoNightMode: settings.get('autoNightMode', false),
  autoLaunch: settings.get('autoLaunch', false),
  hideTray: settings.get('hideTray', false),
  defaultMode: settings.get('defaultMode', true),
  darkMode: settings.get('darkMode', false),
  blackMode: settings.get('blackMode', false),
  sepiaMode: settings.get('sepiaMode', false),
  vibrantMode: settings.get('vibrantMode', false),
  vibrantDarkMode: settings.get('vibrantDarkMode', false),
  alwaysOnTop: settings.get('alwaysOnTop', false),
  useYinxiang: settings.get('useYinxiang', false),
  updateCheckPeriod: settings.get('updateCheckPeriod', '2h'),
  useGlobalShortcuts: settings.get('useGlobalShortcuts', false)
});

module.exports = settings;
