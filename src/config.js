'use strict';
const {readFileSync} = require('fs');
const {ensureFileSync} = require('./util');
const defaultConfig = require('./configs');
const file = require('./file');

const {log} = console;

class Config {
  get shortcutKeys() {
    return this._load.shortcutKeys;
  }

  get _load() {
    ensureFileSync(file.localConfig, JSON.stringify(defaultConfig, null, 4));

    try {
      return JSON.parse(readFileSync(file.localConfig, 'utf8'));
    } catch (error) {
      return log(error);
    }
  }
}

module.exports = new Config();
