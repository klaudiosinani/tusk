'use strict';
const {writeFile} = require('fs');
const electron = require('electron');
const Turndown = require('turndown');
const {is} = require('./util');
const mode = require('./mode');

const {dialog} = electron.remote;
const {log} = console;

class Md {
  get _opts() {
    return {
      filters: [
        {
          name: 'Markdown File',
          extensions: ['md']
        }, {
          name: 'All Files',
          extensions: ['*']
        }
      ]
    };
  }

  _getTitle() {
    const title = document.querySelector('#gwt-debug-NoteTitleView-label').innerHTML;
    return title.length > 0 ? title.trim().replace(/&nbsp;/g, ' ') : 'note';
  }

  _toMarkdown(noteFrame) {
    const turndownUtil = new Turndown();
    return turndownUtil.turndown(noteFrame.contentDocument.body);
  }

  async save() {
    const noteFrame = await mode.getNoteFrame();
    const opts = Object.assign(this._opts, {defaultPath: this._getTitle()});

    dialog.showSaveDialog(opts, path => {
      if (is.undef(path)) {
        return;
      }

      writeFile(path, this._toMarkdown(noteFrame), error => {
        if (error) {
          dialog.showErrorBox('Failed to export note as Markdown', error.message);
          return log(error);
        }
      });
    });
  }
}

module.exports = new Md();
