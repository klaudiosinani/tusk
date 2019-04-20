'use strict';
const {dirname, join} = require('path');
const fs = require('fs');
const decodeUri = require('decode-uri-component');
const url = require('./url');

const {log} = console;
const {platform} = process;

class Util {
  get is() {
    return {
      darwin: platform === 'darwin',
      downloadURL: x => x.split('/', 4).includes('shard'),
      linux: platform === 'linux',
      undef: x => x === undefined,
      win32: platform === 'win32'
    };
  }

  ensureFileSync(path, data) {
    if (!fs.existsSync(path)) {
      try {
        fs.writeFileSync(path, data);
      } catch (error) {
        log(error);
      }
    }
  }

  formatExternal(x) {
    return `file://${x}`;
  }

  formatTitle(x) {
    return x.replace(' | Evernote Web', '');
  }

  formatURL(x) {
    return decodeUri(x.replace(url.redirect, ''));
  }

  formatYinxiangURL(x) {
    return decodeUri(x.replace(url.yinxiangRedirect, ''));
  }

  readSheet(x) {
    return fs.readFileSync(join(__dirname, './style', x), 'utf8');
  }

  touchFileSync(x) {
    const dir = dirname(x);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    return fs.closeSync(fs.openSync(x, 'a'));
  }
}
module.exports = new Util();
