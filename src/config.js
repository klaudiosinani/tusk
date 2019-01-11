'use strict';
const fs = require('fs');
const defaultConfig = require('./configs');
const file = require('./file');

const {log} = console;

class Config {
  constructor() {
    this._default = Object.assign({}, defaultConfig);
  }

  get _local() {
    try {
      return JSON.parse(fs.readFileSync(file.localConfig, 'utf8'));
    } catch (error) {
      return log(error);
    }
  }

  get configuration() {
    this._ensureLocalConfig(file.localConfig);
    return this._local;
  }

  get shortcutKeys() {
    return this.configuration.shortcutKeys;
  }

  _updateConfig(data) {
    const result = Object.assign({}, this._default);

    Object.keys(data).forEach(type => {
      result[type] = Object.assign({}, result[type], data[type]);
    });

    Object.keys(result).forEach(type => {
      const [opts, defaultOpts] = [data[type], this._default[type]].map(Object.keys);
      const deprecated = opts.filter(x => !defaultOpts.includes(x));
      deprecated.forEach(x => delete result[type][x]);
    });

    return result;
  }

  _ensureLocalConfig(path) {
    const data = fs.existsSync(path) ? this._updateConfig(this._local) : this._default;
    try {
      fs.writeFileSync(path, JSON.stringify(data, null, 4));
    } catch (error) {
      log(error);
    }
  }
}

module.exports = new Config();
