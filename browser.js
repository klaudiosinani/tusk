'use strict';
const electron = require('electron');

const {ipcRenderer: ipc} = electron;

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
  document.querySelector('#gwt-debug-AccountMenu-settings').click();
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

ipc.on('checkbox', () => {
  // Toggle checkbox
  document.querySelector('#gwt-debug-FormattingBar-checkboxButton').click();
});

ipc.on('code-block', () => {
  // Toggle code-block
  document.querySelector('#gwt-debug-FormattingBar-codeBlockButton').click();
});
