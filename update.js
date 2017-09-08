'use strict';
const electron = require('electron');
const get = require('simple-get');

const app = electron.app;
const shell = electron.shell;
const dialog = electron.dialog;
const currentVersion = app.getVersion();
const updateURL = 'https://champloohq.github.io/tusk/update.json';

function checkUpdate(err, res, data) {
  if (err) {
    console.log('Update error.');
  } else if (res.statusCode === 200) {
    // Updating URL resolved properly
    try {
      data = JSON.parse(data); // Parse JSON safely
    } catch (err) {
      console.log('Invalid JSON object');
    }
    const latestVersion = data.version; // Get the latest version
    console.log('Latest version of Tusk is: ' + latestVersion);
    console.log('You are running Tusk on version: ' + currentVersion);
    if (latestVersion === currentVersion) {
      // User is already on the latest version
      console.log('You are on the latest version');
    } else {
      // An updated version has been released
      console.log('An update is available');
      const result = dialog.showMessageBox({
        type: 'info',
        buttons: ['Download', 'Dismiss'],
        defaultId: 0, // Make `Download` the default action button
        title: 'Update Tusk',
        message: 'Version ' + latestVersion + ' is now available',
        detail: 'Click Download to get it now'
      });
      response(result); // Check which button was pressed based on index
    }
  } else {
    // Updating URL did not resolve properly
    console.log('Unexpected status code error');
  }
}

function response(result) {
  // If the `Download` button was pressed
  // send the user to the latest Github release
  if (result === 0) {
    shell.openExternal('https://github.com/champloohq/tusk/releases/latest');
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
  const feedURL = `https://hazel-cqlccwdbrf.now.sh/update/${process.platform}/${version}`;
  electron.autoUpdater.setFeedURL(feedURL);
};

module.exports.checkUpdate = () => {
  if (process.platform === 'win32') {
    // Auto-update on Windows
    electron.autoUpdater.checkForUpdates();
  } else {
    // Check for updates manually on Linux/Macos
    get.concat(updateURL, checkUpdate);
  }
};
