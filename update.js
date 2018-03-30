'use strict';
const path = require('path');
const electron = require('electron');
const get = require('simple-get');

const app = electron.app;
const shell = electron.shell;
const dialog = electron.dialog;
const installedVersion = app.getVersion();
const updateURL = 'https://klauscfhq.github.io/tusk/update.json';
const releaseURL = 'https://github.com/klauscfhq/tusk/releases/latest';

function displayAvailableUpdate(latestVersion) {
  // Display available update info-window
  const result = dialog.showMessageBox({
    icon: path.join(__dirname, 'static/Icon.png'),
    title: 'Update Tusk',
    message: 'Version ' + latestVersion + ' is now available',
    detail: 'Click Download to get it now',
    buttons: ['Download', 'Dismiss'],
    defaultId: 0, // Make `Download` the default action button
    cancelId: 1
  });
  console.log('Update to version', latestVersion, 'is now available');
  return result;
}

function displayUnavailableUpdate(installedVersion) {
  // Display unavailable update info-window
  const result = dialog.showMessageBox({
    icon: path.join(__dirname, 'static/Icon.png'),
    title: 'No Update Available',
    message: 'No update available',
    detail: 'Version ' + installedVersion + ' is the latest version'
  });
  console.log('You are on the latest version', installedVersion);
  return result;
}

function getLatestVersion(err, res, data) {
  if (err) {
    console.log('Update error.');
  } else if (res.statusCode === 200) {
    // Updating URL resolved properly
    try {
      // Safely parse JSON
      data = JSON.parse(data);
    } catch (err) {
      console.log('Invalid JSON object');
    }
    // Get latest version
    const latestVersion = data.version;
    return latestVersion;
  } else {
    // Updating URL did not resolve properly
    console.log('Unexpected status code error');
  }
}

function response(result) {
  // If the `Download` button was pressed
  // send the user to the latest Github release
  if (result === 0) {
    shell.openExternal(releaseURL);
  }
}

function manualUpdateCheck(err, res, data) {
  // Manually check for updates
  const latestVersion = getLatestVersion(err, res, data);
  if (latestVersion === installedVersion) {
    // No updates available
    displayUnavailableUpdate(installedVersion);
  } else {
    // Set out update notification & get user response
    const result = displayAvailableUpdate(latestVersion);
    response(result);
  }
}

function autoUpdateCheck(err, res, data) {
  // Automatically check for updates
  const latestVersion = getLatestVersion(err, res, data);
  if (latestVersion !== installedVersion) {
    // Set out update notification & get user response
    const result = displayAvailableUpdate(latestVersion);
    response(result);
  }
}

module.exports.init = () => {
  if (process.platform !== 'win32') {
    return;
  }

  electron.autoUpdater.on('checking-for-update', () => {
    console.log('checking-for-update');
  });

  electron.autoUpdater.on('update-available', () => {
    console.log('update-available');
  });

  electron.autoUpdater.on('update-not-available', () => {
    console.log('update-not-available');
  });

  electron.autoUpdater.on('update-downloaded', () => {
    console.log('update-downloaded');
  });

  electron.autoUpdater.on('error', err => {
    console.log('Error fetching updates', err);
  });

  const version = electron.app.getVersion();
  const feedURL = `https://tusk.now.sh/update/${process.platform}/${version}`;
  electron.autoUpdater.setFeedURL(feedURL);
};

module.exports.autoUpdateCheck = () => {
  if (process.platform === 'win32') {
    // Auto-update on Windows
    electron.autoUpdater.checkForUpdates();
  } else {
    // Check for updates automatically on Linux/Macos
    get.concat(updateURL, autoUpdateCheck);
  }
};

module.exports.manualUpdateCheck = () => {
  // Check for updates manually
  get.concat(updateURL, manualUpdateCheck);
};
