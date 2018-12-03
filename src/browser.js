'use strict';
const electron = require('electron');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const timeStamp = require('time-stamp');
const Turndown = require('turndown');
const config = require('./config');

const {join} = path;
const {dialog} = electron.remote;
const {ipcRenderer: ipc, shell, webFrame} = electron;

const tuskJSON = '.tusk.json';
const homeDir = os.homedir();
const homeConfig = join(homeDir, tuskJSON);

ipc.on('new-note', () => {
  document.querySelector('#gwt-debug-Sidebar-newNoteButton').click();
});

ipc.on('delete-note', () => {
  document.querySelector('#gwt-debug-NoteAttributes-trashButton').click();
});

ipc.on('new-notebook', () => {
  const notebooks = document.querySelector('#gwt-debug-Sidebar-notebooksButton');
  notebooks.click();
  document.querySelector('#gwt-debug-NotebooksDrawer-createNotebookButton').click();
  notebooks.click();
});

ipc.on('new-tag', () => {
  const tags = document.querySelector('#gwt-debug-Sidebar-tagsButton');
  tags.click();
  document.querySelector('.focus-drawer-TagsDrawer-TagsDrawer-create-tag-icon').click();
  tags.click();
});

ipc.on('add-shortcut', () => {
  document.querySelector('#gwt-debug-NoteAttributes-shortcutButton').click();
});

ipc.on('set-reminder', () => {
  document.querySelector('#gwt-debug-NoteAttributes-reminderButton').click();
});

ipc.on('search', () => {
  document.querySelector('#gwt-debug-Sidebar-searchButton').click();
});

ipc.on('focus-mode', () => {
  const mode = {
    enter() {
      document.querySelector('#gwt-debug-NoteAttributes-focusButton').click();
    },
    exit() {
      document.querySelector('#gwt-debug-NoteAttributes-doneButton').click();
    }
  };

  const isFocusMode = () => {
    return document.querySelector('#gwt-debug-NoteAttributes-focusButton').style.length;
  };

  return isFocusMode() ? mode.exit() : mode.enter();
});

ipc.on('header-one', () => {
  document.querySelector('#gwt-debug-FontSizeDropdown-root-THIRTY_SIX').click();
});

ipc.on('header-two', () => {
  document.querySelector('#gwt-debug-FontSizeDropdown-root-TWENTY_FOUR').click();
});

ipc.on('header-three', () => {
  document.querySelector('#gwt-debug-FontSizeDropdown-root-EIGHTEEN').click();
});

ipc.on('header-four', () => {
  document.querySelector('#gwt-debug-FontSizeDropdown-root-FOURTEEN').click();
});

ipc.on('header-five', () => {
  document.querySelector('#gwt-debug-FontSizeDropdown-root-TWELVE').click();
});

ipc.on('header-six', () => {
  document.querySelector('#gwt-debug-FontSizeDropdown-root-TEN').click();
});

function untoggleTheme(themeName, activateFunction) {
  switch (config.get(themeName)) {
    case true:
      config.set(themeName, false);
      activateFunction();
      break;

    default:
      break;
  }
  changeFontColor({color: 'black', theme: 'defaultMode'});
}

function getNoteFrame() {
  return new Promise(resolve => {
    function checkNoteFrame() {
      const frame = document.querySelector('.RichTextArea-entinymce');
      if (frame) {
        resolve(frame);
      }
      setTimeout(checkNoteFrame, 50);
    }
    checkNoteFrame();
  });
}

async function changeFontColor(optionsObj) {
  const {color, theme} = optionsObj;
  if (config.get(theme)) {
    const frame = await getNoteFrame();
    const style = document.createElement('style');
    style.textContent = `body {color: ${color};}`;
    return frame.contentDocument.head.appendChild(style);
  }
}

function darkMode() {
  document.documentElement.classList.toggle('dark-mode', config.get('darkMode'));
  changeFontColor({color: 'lightgrey', theme: 'darkMode'});
}

function untoggleDark() {
  untoggleTheme('darkMode', darkMode);
}

ipc.on('toggle-dark-mode', () => {
  untoggleSepia();
  untoggleBlack();
  config.set('darkMode', !config.get('darkMode'));
  darkMode();
});

function blackMode() {
  document.documentElement.classList.toggle('black-mode', config.get('blackMode'));
  changeFontColor({color: 'lightgrey', theme: 'blackMode'});
}

function untoggleBlack() {
  untoggleTheme('blackMode', blackMode);
}

ipc.on('toggle-black-mode', () => {
  untoggleDark();
  untoggleSepia();
  config.set('blackMode', !config.get('blackMode'));
  blackMode();
});

function sepiaMode() {
  document.documentElement.classList.toggle('sepia-mode', config.get('sepiaMode'));
  changeFontColor({color: 'black', theme: 'sepiaMode'});
}

function untoggleSepia() {
  untoggleTheme('sepiaMode', sepiaMode);
}

ipc.on('toggle-sepia-mode', () => {
  untoggleBlack();
  untoggleDark();
  config.set('sepiaMode', !config.get('sepiaMode'));
  sepiaMode();
});

function autoNightMode() {
  const time = timeStamp('HHmm');
  switch (time <= 1800 && time >= 600) {
    case true:
      untoggleDark();
      untoggleBlack();
      untoggleSepia();
      break;

    case false:
      untoggleBlack();
      untoggleSepia();
      config.set('darkMode', true);
      darkMode();
      break;

    default:
      break;
  }
}

function untoggleAutoNightMode() {
  untoggleDark();
}

ipc.on('auto-night-mode', () => {
  if (config.get('autoNightMode')) {
    autoNightMode();
  } else {
    untoggleAutoNightMode();
  }
});

function toggleSideBar() {
  document.documentElement.classList.toggle('side-bar-hidden', config.get('sideBarHidden'));
  if (process.platform === 'darwin') {
    // Macos visual tweak
    document.documentElement.classList.toggle('side-bar-hidden-macos', config.get('sideBarHidden'));
  }
}

ipc.on('toggle-side-bar', () => {
  config.set('sideBarHidden', !config.get('sideBarHidden'));
  toggleSideBar();
});

function toggleMenuBar() {
  ipc.send('activate-menu-bar');
}

ipc.on('toggle-menu-bar', () => {
  config.set('menuBarHidden', !config.get('menuBarHidden'));
  toggleMenuBar();
});

function goToNote(key) {
  const index = key;
  selectNote(index);
}

const noteSelector = '.focus-NotesView-Note';
const notesList = '.NotesView-ScrollWindow > div';
const notesListSelector = '.NotesView-ScrollWindow';
const selectedNoteSelector = '.focus-NotesView-Note-selected';

function scroll(pixels, downwards) {
  const notesScrollbox = document.querySelector(notesListSelector);
  if (downwards) {
    notesScrollbox.scrollTop += pixels;
  } else {
    notesScrollbox.scrollTop -= pixels;
  }
}

function selectNote(index) {
  document.querySelector(notesList).children[index].firstChild.firstChild.click();
}

function goToNextNote() {
  const index = getCurrentIndex();
  const nextIndex = getNextIndex(index);
  console.log('Next note index is: ' + nextIndex);
  selectNote(nextIndex);
  scroll(110, true);
}

function goToPreviewsNote() {
  const index = getCurrentIndex();
  const previewsIndex = getPreviewsIndex(index);
  console.log('Previews note index is: ' + previewsIndex);
  selectNote(previewsIndex);
  scroll(110, false);
}

function getCurrentIndex() {
  let i;
  let currentIndex;
  let notesArray = [];

  const selectedNote = document.querySelector(selectedNoteSelector);
  notesArray = document.querySelector(notesListSelector).querySelectorAll(noteSelector);

  for (i = 0; i < notesArray.length; i++) {
    if (notesArray[i] === selectedNote) {
      currentIndex = i + 1;
      console.log('The currently selected note has an index of: ' + currentIndex);
    }
  }

  return currentIndex;
}

function getNextIndex(currentIndex) {
  const nextIndex = currentIndex + 1;
  console.log('The next note will have an index of: ' + nextIndex);
  return nextIndex;
}

function getPreviewsIndex(currentIndex) {
  const previewsIndex = currentIndex - 1;
  console.log('The previews note will have an index of: ' + previewsIndex);
  return previewsIndex;
}

function printToPDF() {
  ipc.send('print-to-pdf');
}

ipc.on('print', printToPDF);

function exportAsPDF() {
  ipc.send('export-as-pdf');
}

ipc.on('export', exportAsPDF);

async function exportAsMarkdown() {
  const selectedNoteFrame = await getNoteFrame();

  const getTitle = () => {
    const title = document.querySelector('#gwt-debug-NoteTitleView-label').innerHTML;
    return title.length > 0 ? title.trim().replace(/&nbsp;/g, ' ') : 'note';
  };

  const toMarkdown = noteFrame => {
    const turndownUtil = new Turndown();
    return turndownUtil.turndown(noteFrame.contentDocument.body);
  };

  const options = {
    defaultPath: getTitle(),
    filters: [{
      name: 'Markdown File',
      extensions: ['md']
    }, {
      name: 'All Files',
      extensions: ['*']
    }]
  };

  dialog.showSaveDialog(options, fileName => {
    if (fileName === undefined) {
      return console.log('Note was not exported');
    }
    fs.writeFile(fileName, toMarkdown(selectedNoteFrame), error => {
      if (error) {
        dialog.showErrorBox('Exporting note as Markdown error', error.message);
        return console.log(error.message);
      }
    });
  });
}

ipc.on('export-as-markdown', exportAsMarkdown);

function toggleAutoLaunch() {
  const startup = require('./startup');

  if (config.get('autoLaunch')) {
    startup.activate();
  } else {
    startup.deactivate();
  }
}

ipc.on('auto-launch', toggleAutoLaunch);

ipc.on('next-note', goToNextNote);

ipc.on('previous-note', goToPreviewsNote);

ipc.on('toggle-notebooks', () => {
  document.querySelector('#gwt-debug-Sidebar-notebooksButton').click();
});

ipc.on('toggle-tags', () => {
  document.querySelector('#gwt-debug-Sidebar-tagsButton').click();
});

ipc.on('shortcuts', () => {
  document.querySelector('#gwt-debug-Sidebar-shortcutsButton').click();
});

ipc.on('return', () => {
  document.querySelector('#gwt-debug-Sidebar-notesButton').click();
});

ipc.on('zoom-in', () => {
  const currentZoomFactor = webFrame.getZoomFactor();
  const zoomFactor = currentZoomFactor + 0.05;

  if (zoomFactor < 1.3) {
    webFrame.setZoomFactor(zoomFactor);
    config.set('zoomFactor', zoomFactor);
  }
});

ipc.on('zoom-out', () => {
  const currentZoomFactor = webFrame.getZoomFactor();
  const zoomFactor = currentZoomFactor - 0.05;

  if (zoomFactor > 0.7) {
    webFrame.setZoomFactor(zoomFactor);
    config.set('zoomFactor', zoomFactor);
  }
});

ipc.on('zoom-reset', () => {
  webFrame.setZoomFactor(1.0);
  config.set('zoomFactor', 1.0);
});

ipc.on('settings', () => {
  shell.openExternal('https://www.evernote.com/Settings.action');
});

ipc.on('edit-shortcuts', () => {
  shell.openExternal(homeConfig);
});

ipc.on('log-out', () => {
  document.querySelector('#gwt-debug-AccountMenu-avatar').click();
  document.querySelector('#gwt-debug-AccountMenu-logout').click();
});

ipc.on('bold', () => {
  document.querySelector('#gwt-debug-FormattingBar-boldButton').click();
});

ipc.on('italic', () => {
  document.querySelector('#gwt-debug-FormattingBar-italicButton').click();
});

ipc.on('underline', () => {
  document.querySelector('#gwt-debug-FormattingBar-underlineButton').click();
});

ipc.on('add-link', () => {
  document.querySelector('#gwt-debug-FormattingBar-linkButton').click();
});

ipc.on('attach-file', () => {
  document.querySelector('#gwt-debug-FormattingBar-linkButton').click();
});

ipc.on('insert-drive', () => {
  document.querySelector('#gwt-debug-FormattingBar-attachmentButton').click();
});

ipc.on('align-left', () => {
  document.querySelector('#gwt-debug-EditorAlignDropdown-left').click();
});

ipc.on('align-center', () => {
  document.querySelector('#gwt-debug-EditorAlignDropdown-center').click();
});

ipc.on('align-right', () => {
  document.querySelector('#gwt-debug-EditorAlignDropdown-right').click();
});

ipc.on('indent', () => {
  document.querySelector('#gwt-debug-FormattingBar-indentButton').click();
});

ipc.on('outdent', () => {
  document.querySelector('#gwt-debug-FormattingBar-outdentButton').click();
});

ipc.on('numbered', () => {
  document.querySelector('#gwt-debug-FormattingBar-listButton').click();
});

ipc.on('bulleted', () => {
  document.querySelector('#gwt-debug-FormattingBar-bulletButton').click();
});

ipc.on('strikethrough', () => {
  document.querySelector('#gwt-debug-FormattingBar-strikeButton').click();
});

ipc.on('checkbox', () => {
  document.querySelector('#gwt-debug-FormattingBar-checkboxButton').click();
});

ipc.on('code-block', () => {
  document.querySelector('#gwt-debug-FormattingBar-codeBlockButton').click();
});

ipc.on('subscript', () => {
  const formatMenu = document.querySelector('#gwt-debug-FormattingBar-overflowButton');
  formatMenu.click();
  document.querySelector('#gwt-debug-FormattingBar-subscriptButton').click();
});

ipc.on('superscript', () => {
  const formatMenu = document.querySelector('#gwt-debug-FormattingBar-overflowButton');
  formatMenu.click();
  document.querySelector('#gwt-debug-FormattingBar-superscriptButton').click();
});

ipc.on('remove-formatting', () => {
  document.querySelector('#gwt-debug-FormattingBar-noFormatButton').click();
});

ipc.on('horizontal-rule', () => {
  document.querySelector('#gwt-debug-FormattingBar-horizontalRuleButton').click();
});

document.addEventListener('keydown', event => {
  let comboKey;

  if (process.platform === 'darwin') {
    comboKey = event.metaKey;
  } else {
    comboKey = event.ctrlKey;
  }

  if (comboKey === false) {
    return null;
  }

  const givenNum = parseInt(event.key, 10);

  if (givenNum < 10 && givenNum > 0) {
    goToNote(givenNum);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const zoomFactor = config.get('zoomFactor');
  webFrame.setZoomFactor(zoomFactor);
  if (config.get('autoNightMode')) {
    autoNightMode();
  }

  toggleSideBar();
  toggleMenuBar();
  sepiaMode();
  blackMode();
  darkMode();

  getNoteFrame().then(noteDOM => {
    noteDOM.contentDocument.body.setAttribute('dir', 'auto');
    document.getElementById('gwt-debug-NoteTitleView-container').setAttribute('dir', 'auto');
  });
});
