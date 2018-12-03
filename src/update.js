'use strict';
const path = require('path');
const electron = require('electron');
const get = require('simple-get');

const {app, dialog, shell} = electron;
const installedVersion = app.getVersion();
const updateURL = 'https://klaussinani.github.io/tusk/update.json';
const releaseURL = 'https://github.com/klaussinani/tusk/releases/latest';

function displayAvailableUpdate(latestVersion) {
  const result = dialog.showMessageBox({
    icon: path.join(__dirname, 'static/Icon.png'),
    title: 'Update Tusk',
    message: 'Version ' + latestVersion + ' is now available',
    detail: 'Click Download to get it now',
    buttons: ['Download', 'Dismiss'],
    defaultId: 0,
    cancelId: 1
  });
  console.log('Update to version', latestVersion, 'is now available');
  return result;
}

function displayUnavailableUpdate(installedVersion) {
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
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.log('Invalid JSON object');
    }

    const latestVersion = data.version;
    return latestVersion;
  } else {
    console.log('Unexpected status code error');
  }
}

function response(result) {
  if (result === 0) {
    shell.openExternal(releaseURL);
  }
}

function manualUpdateCheck(err, res, data) {
  const latestVersion = getLatestVersion(err, res, data);
  if (latestVersion === installedVersion) {
    displayUnavailableUpdate(installedVersion);
  } else {
    const result = displayAvailableUpdate(latestVersion);
    response(result);
  }
}

function autoUpdateCheck(err, res, data) {
  const latestVersion = getLatestVersion(err, res, data);
  if (latestVersion !== installedVersion) {
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
    electron.autoUpdater.checkForUpdates();
  } else {
    get.concat(updateURL, autoUpdateCheck);
  }
};

module.exports.manualUpdateCheck = () => {
  get.concat(updateURL, manualUpdateCheck);
};
