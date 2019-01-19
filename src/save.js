'use strict';
const {writeFile} = require('fs');
const electron = require('electron');
const Turndown = require('turndown');
const {is} = require('./util');
const mode = require('./mode');

const {dialog} = electron.remote;
const {log} = console;

class Save {
  get _opts() {
    return {
      md: {
        filters: [
          {
            name: 'Markdown File',
            extensions: ['md']
          }, {
            name: 'All Files',
            extensions: ['*']
          }
        ]
      },
      html: {
        filters: [
          {
            name: 'HTML File',
            extensions: ['html']
          }, {
            name: 'All Files',
            extensions: ['*']
          }
        ]
      }
    };
  }

  _getTitle() {
    const title = document.querySelector('#gwt-debug-NoteTitleView-label').innerHTML;
    return title.length > 0 ? title.trim().replace(/&nbsp;/g, ' ') : 'note';
  }

  _toHTML(noteFrame) {
    return noteFrame.contentDocument.body.innerHTML;
  }

  _toMarkdown(noteFrame) {
    const turndownUtil = new Turndown();
    return turndownUtil.turndown(noteFrame.contentDocument.body);
  }

  _save(opts, data) {
    const options = Object.assign(opts, {defaultPath: this._getTitle()});

    dialog.showSaveDialog(options, path => {
      if (is.undef(path)) {
        return;
      }

      writeFile(path, data, error => {
        if (error) {
          dialog.showErrorBox('Failed to export note.', error.message);
          return log(error);
        }
      });
    });
  }

  async md() {
    const noteFrame = await mode.getNoteFrame();
    return this._save(this._opts.md, this._toMarkdown(noteFrame));
  }

  async html() {
    const noteFrame = await mode.getNoteFrame();
    return this._save(this._opts.html, this._toHTML(noteFrame));
  }
}

module.exports = new Save();
