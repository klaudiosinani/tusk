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

ipc.on('align-left', () => {
  // Align text left
  const alignMenu = document.querySelector('#gwt-debug-FormattingBar-alignButton');
  alignMenu.click();
  document.querySelector('#gwt-debug-EditorAlignDropdown-left').click();
});

ipc.on('align-center', () => {
  // Align text center
  const alignMenu = document.querySelector('#gwt-debug-FormattingBar-alignButton');
  alignMenu.click();
  document.querySelector('#gwt-debug-EditorAlignDropdown-center').click();
});

ipc.on('align-right', () => {
  // Align text right
  const alignMenu = document.querySelector('#gwt-debug-FormattingBar-alignButton');
  alignMenu.click();
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
