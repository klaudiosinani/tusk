'use strict';
const electron = require('electron');
const config = require('./config');

const ipc = electron.ipcRenderer;
const shell = electron.shell;

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
  document.querySelector('#gwt-debug-NoteAttributes-focusButton').click();
});

ipc.on('exit-focus-mode', () => {
  // Exit focus mode
  document.querySelector('#gwt-debug-NoteAttributes-doneButton').click();
});

function darkMode() {
  document.documentElement.classList.toggle('dark-mode', config.get('darkMode'));
}

ipc.on('toggle-dark-mode', () => {
  config.set('darkMode', !config.get('darkMode'));
  darkMode();
});

function blackMode() {
  document.documentElement.classList.toggle('black-mode', config.get('blackMode'));
}

ipc.on('toggle-black-mode', () => {
  config.set('blackMode', !config.get('blackMode'));
  blackMode();
});

function goToNote(key) {
  const index = key;
  selectNote(index);
}

const notesList = '.NotesView-ScrollWindow > div';

// Select the appropriate note based on given index
function selectNote(index) {
  document.querySelector(notesList).children[index].firstChild.firstChild.click();
}

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

ipc.on('settings', () => {
  // Toggle Settings
  shell.openExternal('https://www.evernote.com/Settings.action');
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
  document.querySelector('#gwt-debug-FormattingBar-attachmentButton.GDAMOPFCE0.GDAMOPFCE1').click();
});

ipc.on('insert-drive', () => {
  // Add link
  document.querySelector('#gwt-debug-FormattingBar-attachmentButton.GDAMOPFCA1.GDAMOPFCE1').click();
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
  if (givenNum >= 1 && givenNum <= 9) {
    goToNote(givenNum);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Toggle black mode
  blackMode();
  // Toggle dark mode
  darkMode();
  // Prevent white flashing screen on startup
  document.documentElement.style.backgroundColor = '#212121';
});
