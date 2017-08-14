'use strict';
const electron = require('electron');

const {ipcRenderer: ipc} = electron;

ipc.on('focus-mode', () => {
  // Toggle focus mode
  document.querySelector('.GDAMOPFCLLB').click();
});
