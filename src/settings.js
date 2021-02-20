'use strict';
const settings = require('electron-settings');
const { touchFileSync } = require('./util');

touchFileSync(settings.file());

const options = {
  alwaysOnTop: (settings.getSync('alwaysOnTop') || false),
  autoLaunch: (settings.getSync('autoLaunch') || false),
  autoNightMode: (settings.getSync('autoNightMode') || false),
  disableAutoUpdateCheck: (settings.getSync('disableAutoUpdateCheck') || false),
  hideTray: (settings.getSync('hideTray') || false),
  lastWindowState: ({
    x: (settings.getSync('lastWindowState.x')),
    y: (settings.getSync('lastWindowState.y')),
    width: (settings.getSync('lastWindowState.width')),
    height: (settings.getSync('lastWindowState.height'))
  }),
  launchMinimized: (settings.getSync('launchMinimized') || false),
  menuBarHidden: (settings.getSync('menuBarHidden') || false),
  mode: ({
    black: (settings.getSync('mode.black') || false),
    dark: (settings.getSync('mode.dark') || false),
    sepia: (settings.getSync('mode.sepia') || false)
  }),
  requestExitConfirmation: (settings.getSync('requestExitConfirmation') || true),
  sideBarHidden: (settings.getSync('sideBarHidden') || false),
  updateCheckPeriod: (settings.getSync('updateCheckPeriod') || '4'),
  useGlobalShortcuts: (settings.getSync('useGlobalShortcuts') || false),
  useYinxiang: (settings.getSync('useYinxiang') || false),
  zoomFactor: (settings.getSync('zoomFactor') || 1)
};

settings.setSync(options);

module.exports = settings;
