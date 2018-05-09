'use strict';
const electron = require('electron');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const timeStamp = require('time-stamp');
const Turndown = require('turndown');
const config = require('./config');

const join = path.join;
const ipc = electron.ipcRenderer;
const dialog = electron.remote.dialog;
const shell = electron.shell;
const webFrame = electron.webFrame;

const tuskJSON = '.tusk.json'; // Config file name
const homeDir = os.homedir();
const homeConfig = join(homeDir, tuskJSON); // Config file on home directory

ipc.on('new-note', () => {
  // Create new note
  document.querySelector('#gwt-debug-Sidebar-newNoteButton').click();
});

ipc.on('delete-note', () => {
  // Delete note
  document.querySelector('#gwt-debug-NoteAttributes-trashButton').click();
});

ipc.on('new-notebook', () => {
  // Create new notebook
  const notebooks = document.querySelector('#gwt-debug-Sidebar-notebooksButton');
  notebooks.click();
  document.querySelector('#gwt-debug-NotebooksDrawer-createNotebookButton').click();
  notebooks.click();
});

ipc.on('new-tag', () => {
  // Create new tag
  const tags = document.querySelector('#gwt-debug-Sidebar-tagsButton');
  tags.click();
  document.querySelector('.focus-drawer-TagsDrawer-TagsDrawer-create-tag-icon').click();
  tags.click();
});

ipc.on('add-shortcut', () => {
  // Add shortcut
  document.querySelector('#gwt-debug-NoteAttributes-shortcutButton').click();
});

ipc.on('set-reminder', () => {
  // Set reminder
  document.querySelector('#gwt-debug-NoteAttributes-reminderButton').click();
});

ipc.on('search', () => {
  // Search notes
  document.querySelector('#gwt-debug-Sidebar-searchButton').click();
});

ipc.on('focus-mode', () => {
  // Toggle focus mode
  const mode = {
    enter() {
      document.querySelector('#gwt-debug-NoteAttributes-focusButton').click();
    },
    exit() {
      document.querySelector('#gwt-debug-NoteAttributes-doneButton').click();
    }
  };

  const isFocusMode = () => {
    // Check if focus-mode is already active
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
  // Deactivate theme status if it is not already deactivated
  switch (config.get(themeName)) {
    case true:
      config.set(themeName, false);
      activateFunction();
      break;

    default:
      break;
  }
  // Switch to default font color
  changeFontColor({color: 'black', theme: 'defaultMode'});
}

function getNoteFrame() {
  // Retrieve the <iframe> tag where notes reside
  return new Promise(resolve => {
    function checkNoteFrame() {
      // Wait until all notes have been loaded
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
  // Change the default font color of all notes
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
  // Untoggle the dark theme
  untoggleTheme('darkMode', darkMode);
}

ipc.on('toggle-dark-mode', () => {
  untoggleSepia();
  untoggleBlack();
  untoggleVibrant();
  untoggleDarkVibrant();
  // Toggle the dark theme
  config.set('darkMode', !config.get('darkMode'));
  darkMode();
});

function blackMode() {
  document.documentElement.classList.toggle('black-mode', config.get('blackMode'));
  changeFontColor({color: 'lightgrey', theme: 'blackMode'});
}

function untoggleBlack() {
  // Untoggle the black theme
  untoggleTheme('blackMode', blackMode);
}

ipc.on('toggle-black-mode', () => {
  untoggleDark();
  untoggleSepia();
  untoggleVibrant();
  untoggleDarkVibrant();
  // Toggle the black theme
  config.set('blackMode', !config.get('blackMode'));
  blackMode();
});

function sepiaMode() {
  document.documentElement.classList.toggle('sepia-mode', config.get('sepiaMode'));
  changeFontColor({color: 'black', theme: 'sepiaMode'});
}

function untoggleSepia() {
  // Untoggle the sepia theme
  untoggleTheme('sepiaMode', sepiaMode);
}

ipc.on('toggle-sepia-mode', () => {
  untoggleBlack();
  untoggleDark();
  untoggleVibrant();
  untoggleDarkVibrant();
  // Toggle the sepia theme
  config.set('sepiaMode', !config.get('sepiaMode'));
  sepiaMode();
});

function vibrantMode() {
  document.documentElement.classList.toggle('vibrant-mode', config.get('vibrantMode'));
  // Activate vibrant mode on main window
  ipc.send('activate-vibrant');
  // Make app background transparent
  document.documentElement.style.backgroundColor = 'transparent';
  changeFontColor({color: 'black', theme: 'vibrantMode'});
}

function untoggleVibrant() {
  // Untoggle the vibrant theme
  untoggleTheme('vibrantMode', vibrantMode);
}

ipc.on('toggle-vibrant-mode', () => {
  untoggleBlack();
  untoggleDark();
  untoggleSepia();
  untoggleDarkVibrant();
  // Toggle the vibrant theme
  config.set('vibrantMode', !config.get('vibrantMode'));
  vibrantMode();
});

function vibrantDarkMode() {
  document.documentElement.classList.toggle('vibrant-dark-mode', config.get('vibrantDarkMode'));
  // Activate dark vibrant mode on main window
  ipc.send('activate-vibrant');
  // Make app background transparent
  document.documentElement.style.backgroundColor = 'transparent';
  changeFontColor({color: 'white', theme: 'vibrantDarkMode'});
}

function untoggleDarkVibrant() {
  // Untoggle the dark vibrant theme
  untoggleTheme('vibrantDarkMode', vibrantDarkMode);
}

ipc.on('toggle-vibrant-dark-mode', () => {
  untoggleBlack();
  untoggleDark();
  untoggleSepia();
  untoggleVibrant();
  // Toggle the dark vibrant theme
  config.set('vibrantDarkMode', !config.get('vibrantDarkMode'));
  vibrantDarkMode();
});

function autoNightMode() {
  // Switch between light and dark themes based on daytime
  const time = timeStamp('HHmm');
  switch (time <= 1800 && time >= 600) {
    case true:
      // Switch to the light theme
      untoggleDark();
      untoggleBlack();
      untoggleSepia();
      untoggleVibrant();
      untoggleDarkVibrant();
      break;

    case false:
      // Switch to the dark theme
      untoggleBlack();
      untoggleSepia();
      untoggleVibrant();
      untoggleDarkVibrant();
      config.set('darkMode', true);
      darkMode();
      break;

    default:
      break;
  }
}

function untoggleAutoNightMode() {
  // Untoggle the auto night mode
  untoggleDark();
}

ipc.on('auto-night-mode', () => {
  // Toggle on and off the auto night mode
  if (config.get('autoNightMode')) {
    autoNightMode();
  } else {
    untoggleAutoNightMode();
  }
});

function toggleSideBar() {
  // Hide side bar & adjust left margin
  document.documentElement.classList.toggle('side-bar-hidden', config.get('sideBarHidden'));
  if (process.platform === 'darwin') {
    // Macos visual tweak
    document.documentElement.classList.toggle('side-bar-hidden-macos', config.get('sideBarHidden'));
  }
}

ipc.on('toggle-side-bar', () => {
  // Toggle on and off the side bar
  config.set('sideBarHidden', !config.get('sideBarHidden'));
  toggleSideBar();
});

function toggleMenuBar() {
  // Activate the menu bar on the main window
  ipc.send('activate-menu-bar');
}

ipc.on('toggle-menu-bar', () => {
  // Toggle on and off the menu bar
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
  // Scroll upwards or downwards on note switch
  const notesScrollbox = document.querySelector(notesListSelector);
  if (downwards) {
    notesScrollbox.scrollTop += pixels;
  } else {
    notesScrollbox.scrollTop -= pixels;
  }
}

function selectNote(index) {
  // Select the appropriate note based on given index
  document.querySelector(notesList).children[index].firstChild.firstChild.click();
}

function goToNextNote() {
  // Navigate to the next note
  const index = getCurrentIndex();
  const nextIndex = getNextIndex(index);
  console.log('Next note index is: ' + nextIndex);
  selectNote(nextIndex);
  scroll(110, true);
}

function goToPreviewsNote() {
  // Navigate to the previews note
  const index = getCurrentIndex();
  const previewsIndex = getPreviewsIndex(index);
  console.log('Previews note index is: ' + previewsIndex);
  selectNote(previewsIndex);
  scroll(110, false);
}

// Calculate the index of the current note
function getCurrentIndex() {
  let i;
  let currentIndex; // Index of current note
  let notesArray = []; // Array of notes

  // Get the css meta of the currently selected note
  const selectedNote = document.querySelector(selectedNoteSelector);
  // Create an array of notes relative to the currently selected note
  notesArray = document.querySelector(notesListSelector).querySelectorAll(noteSelector);

  // Traverse the array and find the index of selected note
  for (i = 0; i < notesArray.length; i++) {
    if (notesArray[i] === selectedNote) {
      // Increment the selected note index
      // since selectNote() navigates to
      // positive non-zero values only
      currentIndex = i + 1;
      console.log('The currently selected note has an index of: ' + currentIndex);
    }
  }
  // Return the current note index
  return currentIndex;
}

// Calculate the index of the next note
// relatively to the current note index
function getNextIndex(currentIndex) {
  const nextIndex = currentIndex + 1; // Index value of next note
  console.log('The next note will have an index of: ' + nextIndex);
  return nextIndex;
}

// Calculate the index of the previews note
// relatively to the current note index
function getPreviewsIndex(currentIndex) {
  const previewsIndex = currentIndex - 1; // Index value of previews note
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
  // Get frame of selected note
  const selectedNoteFrame = await getNoteFrame();

  // Get note title
  const getTitle = () => {
    const title = document.querySelector('#gwt-debug-NoteTitleView-label').innerHTML;
    return title.length ? title.trim().replace(/&nbsp;/g, ' ') : 'note';
  };

  // Covert note to markdown
  const toMarkdown = noteFrame => {
    const turndownUtil = new Turndown();
    return turndownUtil.turndown(noteFrame.contentDocument.body);
  };

  // Saving options
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

  // Initialize saving dialog
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
  // Decide whether or not the app should launch on login
  const startup = require('./startup');

  if (config.get('autoLaunch')) {
    // Activate app launching
    startup.activate();
  } else {
    // Deactivate app launching
    startup.deactivate();
  }
}

ipc.on('auto-launch', toggleAutoLaunch);

ipc.on('next-note', goToNextNote);

ipc.on('previous-note', goToPreviewsNote);

ipc.on('toggle-notebooks', () => {
  // Toggle notebooks list
  document.querySelector('#gwt-debug-Sidebar-notebooksButton').click();
});

ipc.on('toggle-tags', () => {
  // Toggle tags list
  document.querySelector('#gwt-debug-Sidebar-tagsButton').click();
});

ipc.on('shortcuts', () => {
  // Toggle Shortcuts
  document.querySelector('#gwt-debug-Sidebar-shortcutsButton').click();
});

ipc.on('return', () => {
  // Return to Notes
  document.querySelector('#gwt-debug-Sidebar-notesButton').click();
});

ipc.on('zoom-in', () => {
  // Get zoom factor and increase it
  const currentZoomFactor = webFrame.getZoomFactor();
  const zoomFactor = currentZoomFactor + 0.05;
  // Upper bound check
  if (zoomFactor < 1.3) {
    webFrame.setZoomFactor(zoomFactor);
    config.set('zoomFactor', zoomFactor);
  }
});

ipc.on('zoom-out', () => {
  // Get zoom factor and decrease it
  const currentZoomFactor = webFrame.getZoomFactor();
  const zoomFactor = currentZoomFactor - 0.05;
  // Lower bound check
  if (zoomFactor > 0.7) {
    webFrame.setZoomFactor(zoomFactor);
    config.set('zoomFactor', zoomFactor);
  }
});

ipc.on('zoom-reset', () => {
  // Reset zoom factor
  webFrame.setZoomFactor(1.0);
  config.set('zoomFactor', 1.0);
});

ipc.on('settings', () => {
  // Toggle Settings
  shell.openExternal('https://www.evernote.com/Settings.action');
});

ipc.on('edit-shortcuts', () => {
  // Toggle config file
  shell.openExternal(homeConfig);
});

ipc.on('log-out', () => {
  // Log out
  document.querySelector('#gwt-debug-AccountMenu-avatar').click();
  document.querySelector('#gwt-debug-AccountMenu-logout').click();
});

ipc.on('bold', () => {
  // Bold text
  document.querySelector('#gwt-debug-FormattingBar-boldButton').click();
});

ipc.on('italic', () => {
  // Italic text
  document.querySelector('#gwt-debug-FormattingBar-italicButton').click();
});

ipc.on('underline', () => {
  // Underline text
  document.querySelector('#gwt-debug-FormattingBar-underlineButton').click();
});

ipc.on('add-link', () => {
  // Add link
  document.querySelector('#gwt-debug-FormattingBar-linkButton').click();
});

ipc.on('attach-file', () => {
  // Add link
  document.querySelector('#gwt-debug-FormattingBar-linkButton').click();
});

ipc.on('insert-drive', () => {
  // Add link
  document.querySelector('#gwt-debug-FormattingBar-attachmentButton').click();
});

ipc.on('align-left', () => {
  // Align text left
  document.querySelector('#gwt-debug-EditorAlignDropdown-left').click();
});

ipc.on('align-center', () => {
  // Align text center
  document.querySelector('#gwt-debug-EditorAlignDropdown-center').click();
});

ipc.on('align-right', () => {
  // Align text right
  document.querySelector('#gwt-debug-EditorAlignDropdown-right').click();
});

ipc.on('indent', () => {
  // Increase indentation
  document.querySelector('#gwt-debug-FormattingBar-indentButton').click();
});

ipc.on('outdent', () => {
  // Decrease indentation
  document.querySelector('#gwt-debug-FormattingBar-outdentButton').click();
});

ipc.on('numbered', () => {
  // Numbered list
  document.querySelector('#gwt-debug-FormattingBar-listButton').click();
});

ipc.on('bulleted', () => {
  // Bulleted list
  document.querySelector('#gwt-debug-FormattingBar-bulletButton').click();
});

ipc.on('strikethrough', () => {
  // Strikethrough text
  document.querySelector('#gwt-debug-FormattingBar-strikeButton').click();
});

ipc.on('checkbox', () => {
  // Toggle checkbox
  document.querySelector('#gwt-debug-FormattingBar-checkboxButton').click();
});

ipc.on('code-block', () => {
  // Toggle code-block
  document.querySelector('#gwt-debug-FormattingBar-codeBlockButton').click();
});

ipc.on('subscript', () => {
  // Subscript text
  const formatMenu = document.querySelector('#gwt-debug-FormattingBar-overflowButton');
  formatMenu.click();
  document.querySelector('#gwt-debug-FormattingBar-subscriptButton').click();
});

ipc.on('superscript', () => {
  // Superscript text
  const formatMenu = document.querySelector('#gwt-debug-FormattingBar-overflowButton');
  formatMenu.click();
  document.querySelector('#gwt-debug-FormattingBar-superscriptButton').click();
});

ipc.on('remove-formatting', () => {
  // Remove text formatting
  document.querySelector('#gwt-debug-FormattingBar-noFormatButton').click();
});

ipc.on('horizontal-rule', () => {
  // Insert horizontal rule
  document.querySelector('#gwt-debug-FormattingBar-horizontalRuleButton').click();
});

document.addEventListener('keydown', event => {
  let comboKey;

  // OS check
  if (process.platform === 'darwin') {
    comboKey = event.metaKey;
  } else {
    comboKey = event.ctrlKey;
  }

  // Validity check
  if (comboKey === false) {
    return null;
  }

  // Parse as decimal
  const givenNum = parseInt(event.key, 10);

  // Get index
  if (givenNum < 10 && givenNum > 0) {
    goToNote(givenNum);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Preserve zoom factor
  const zoomFactor = config.get('zoomFactor');
  webFrame.setZoomFactor(zoomFactor);
  // Toggle auto night mode
  if (config.get('autoNightMode')) {
    autoNightMode();
  }
  // Toggle the side bar
  toggleSideBar();
  // Toggle the menu bar
  toggleMenuBar();
  // Toggle sepia mode
  sepiaMode();
  // Toggle black mode
  blackMode();
  // Toggle dark mode
  darkMode();
  // Toggle vibrant mode
  vibrantMode();
  // Toggle vibrant dark mode
  vibrantDarkMode();

  getNoteFrame().then(noteDOM => {
    noteDOM.contentDocument.body.setAttribute('dir', 'auto');
    document.getElementById('gwt-debug-NoteTitleView-container').setAttribute('dir', 'auto');
  });
});
