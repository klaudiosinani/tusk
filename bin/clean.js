'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const rimraf = require('rimraf');

const resolve = path.resolve;

const green = chalk.bold.green; // Green bold text
const yellow = chalk.bold.yellow; // Yellow bold text

const distPath = resolve(__dirname, '../dist'); // Dist directory

if (fs.existsSync(distPath)) {
  // Check if the dist directory exists
  try {
    // Clean-up
    rimraf.sync(distPath);
    console.log(green('✔ Cleaning up'));
  } catch (err) {
    console.error(err);
  }
} else {
  console.log(yellow('Nothing to clean-up'));
}
