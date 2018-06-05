'use strict';
const path = require('path');
const fs = require('fs-extra');
const {Signale} = require('signale');

const {resolve} = path;
const distPath = resolve(__dirname, '../dist');

const signale = new Signale({scope: 'Tusk'});

if (fs.existsSync(distPath)) {
  try {
    fs.removeSync(distPath);
    signale.success('Cleaned up');
  } catch (err) {
    signale.error(err);
  }
} else {
  signale.warn('Nothing to clean up');
}
