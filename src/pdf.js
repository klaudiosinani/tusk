'use strict';
const {BrowserWindow, dialog, shell} = require('electron');
const {join} = require('path');
const {tmpdir} = require('os');
const {writeFile} = require('fs');
const {formatExternal, is} = require('./util');
const {stamp} = require('./time');

const {log} = console;

class Pdf {
  get _opts() {
    return {
      filters: [
        {
          name: 'PDF File',
          extensions: ['pdf']
        }, {
          name: 'All Files',
          extensions: ['*']
        }
      ]
    };
  }

  print(event) {
    const path = join(tmpdir(), `Tusk_Note_${stamp()}.pdf`);
    const {webContents} = BrowserWindow.fromWebContents(event.sender);

    webContents.printToPDF({}, (error, data) => {
      if (error) {
        return log(error);
      }

      writeFile(path, data, error => {
        if (error) {
          return log(error);
        }

        shell.openExternal(formatExternal(path));
      });
    });
  }

  save(event, title) {
    const opts = Object.assign(this._opts, {defaultPath: title});
    const {webContents} = BrowserWindow.fromWebContents(event.sender);

    webContents.printToPDF({}, (error, data) => {
      if (error) {
        return log(error);
      }

      dialog.showSaveDialog(opts, path => {
        if (is.undef(path)) {
          return;
        }

        writeFile(path, data, error => {
          if (error) {
            return dialog.showErrorBox('Failed to export note as PDF', error.message);
          }
        });
      });
    });
  }
}

module.exports = new Pdf();
