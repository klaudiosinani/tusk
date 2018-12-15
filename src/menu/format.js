'use strict';
const {BrowserWindow} = require('electron');
const {activate} = require('./../win');
const {setAcc} = require('./../keymap');
const time = require('./../time');

module.exports = {
  label: 'Format',
  submenu: [
    {
      label: 'Style',
      submenu: [
        {
          label: 'Bold text',
          accelerator: setAcc('bold', 'CmdorCtrl+B'),
          click() {
            activate('bold');
          }
        }, {
          label: 'Italic text',
          accelerator: setAcc('italic', 'CmdorCtrl+I'),
          click() {
            activate('italic');
          }
        }, {
          label: 'Underline text',
          accelerator: setAcc('underline', 'CmdorCtrl+U'),
          click() {
            activate('underline');
          }
        }, {
          label: 'Strikethrough text',
          accelerator: setAcc('strikethrough', 'CmdorCtrl+T'),
          click() {
            activate('strikethrough');
          }
        }
      ]
    }, {
      label: 'Font Size',
      submenu: [
        {
          label: 'Header 1',
          accelerator: 'Alt+CmdorCtrl+1',
          click() {
            activate('header-one');
          }
        }, {
          label: 'Header 2',
          accelerator: 'Alt+CmdorCtrl+2',
          click() {
            activate('header-two');
          }
        }, {
          label: 'Header 3',
          accelerator: 'Alt+CmdorCtrl+3',
          click() {
            activate('header-three');
          }
        }, {
          label: 'Header 4',
          accelerator: 'Alt+CmdorCtrl+4',
          click() {
            activate('header-four');
          }
        }, {
          label: 'Header 5',
          accelerator: 'Alt+CmdorCtrl+5',
          click() {
            activate('header-five');
          }
        }, {
          label: 'Header 6',
          accelerator: 'Alt+CmdorCtrl+6',
          click() {
            activate('header-six');
          }
        }
      ]
    }, {
      label: 'Add link',
      accelerator: setAcc('add-link', 'CmdorCtrl+Shift+K'),
      click() {
        activate('add-link');
      }
    }, {
      label: 'Attach file',
      accelerator: setAcc('attach-file', 'CmdorCtrl+Shift+F'),
      click() {
        activate('attach-file');
      }
    }, {
      label: 'Insert from Drive',
      accelerator: setAcc('insert-drive', 'CmdorCtrl+Shift+D'),
      click() {
        activate('insert-drive');
      }
    }, {
      label: 'Paragraph',
      submenu: [
        {
          label: 'Align left',
          accelerator: setAcc('align-left', 'CmdorCtrl+Alt+L'),
          click() {
            activate('align-left');
          }
        }, {
          label: 'Align center',
          accelerator: setAcc('align-center', 'CmdorCtrl+Alt+M'),
          click() {
            activate('align-center');
          }
        }, {
          label: 'Align right',
          accelerator: setAcc('align-right', 'CmdorCtrl+Alt+R'),
          click() {
            activate('align-right');
          }
        }, {
          type: 'separator'
        }, {
          label: 'Increase indentation',
          accelerator: setAcc('increase-indentation', 'CmdorCtrl+Alt+K'),
          click() {
            activate('increase-indentation');
          }
        }, {
          label: 'Decrease indentation',
          accelerator: setAcc('decrease-indentation', 'CmdorCtrl+Shift+M'),
          click() {
            activate('decrease-indentation');
          }
        }, {
          type: 'separator'
        }, {
          label: 'Numbered list',
          accelerator: setAcc('numbered', 'CmdorCtrl+Shift+O'),
          click() {
            activate('numbered');
          }
        }, {
          label: 'Bulleted list',
          accelerator: setAcc('bulleted', 'CmdorCtrl+Shift+.'),
          click() {
            activate('bulleted');
          }
        }
      ]
    }, {
      type: 'separator'
    }, {
      label: 'Insert Date Stamp',
      accelerator: setAcc('date-stamp', 'CmdOrCtrl+Shift+;'),
      click() {
        const [appWindow] = BrowserWindow.getAllWindows();
        appWindow.webContents.insertText(time.date());
      }
    }, {
      label: 'Insert Date-Time Stamp',
      accelerator: setAcc('date-time-stamp', 'CmdOrCtrl+;'),
      click() {
        const [appWindow] = BrowserWindow.getAllWindows();
        appWindow.webContents.insertText(time.dateTime());
      }
    }, {
      type: 'separator'
    }, {
      label: 'Checkbox',
      accelerator: setAcc('checkbox', 'CmdorCtrl+Shift+B'),
      click() {
        activate('checkbox');
      }
    }, {
      label: 'Code block',
      accelerator: setAcc('code-block', 'CmdorCtrl+Shift+L'),
      click() {
        activate('code-block');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Subscript text',
      accelerator: setAcc('subscript', 'CmdorCtrl+Shift+]'),
      click() {
        activate('subscript');
      }
    }, {
      label: 'Superscript text',
      accelerator: setAcc('superscript', 'CmdorCtrl+Shift+['),
      click() {
        activate('superscript');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Remove Formatting',
      accelerator: setAcc('remove-formatting', 'CmdorCtrl+Shift+Space'),
      click() {
        activate('remove-formatting');
      }
    }, {
      label: 'Insert Horizontal Rule',
      accelerator: setAcc('horizontal-rule', 'CmdorCtrl+Shift+-'),
      click() {
        activate('horizontal-rule');
      }
    }
  ]
};
