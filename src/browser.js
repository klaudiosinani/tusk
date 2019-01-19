'use strict';
const {ipcRenderer: ipc} = require('electron');
const mode = require('./mode');
const nav = require('./nav');
const save = require('./save');
const settings = require('./settings');
const startup = require('./startup');

ipc.on('print', () => ipc.send('print-to-pdf'));

ipc.on('export', () => ipc.send('export-as-pdf'));

ipc.on('export-as-markdown', () => save.md());

ipc.on('export-as-html', () => save.html());

ipc.on('auto-launch', () => startup.autoLaunch());

ipc.on('next-note', () => nav.nextNote());

ipc.on('previous-note', () => nav.previousNote());

ipc.on('focus-mode', () => mode.toggleFocus());

ipc.on('toggle-dark-mode', () => mode.dark());

ipc.on('toggle-black-mode', () => mode.black());

ipc.on('toggle-sepia-mode', () => mode.sepia());

ipc.on('auto-night-mode', () => mode.autoNight());

ipc.on('toggle-side-bar', () => {
  settings.set('sideBarHidden', !settings.get('sideBarHidden'));
  nav.sideBar();
});

ipc.on('zoom-in', () => nav.zoomIn());

ipc.on('zoom-out', () => nav.zoomOut());

ipc.on('zoom-reset', () => nav.zoomReset());

ipc.on('log-out', () => {
  nav.click('#gwt-debug-AccountMenu-avatar');
  nav.click('#gwt-debug-AccountMenu-logout');
});

ipc.on('new-notebook', () => {
  const notebooks = nav.select('#gwt-debug-Sidebar-notebooksButton');
  notebooks.click();
  nav.click('#gwt-debug-NotebooksDrawer-createNotebookButton');
  notebooks.click();
});

ipc.on('new-tag', () => {
  const tags = nav.select('#gwt-debug-Sidebar-tagsButton');
  tags.click();
  nav.click('.focus-drawer-TagsDrawer-TagsDrawer-create-tag-icon');
  tags.click();
});

ipc.on('subscript', () => {
  const formatMenu = nav.select('#gwt-debug-FormattingBar-overflowButton');
  formatMenu.click();
  nav.click('#gwt-debug-FormattingBar-subscriptButton');
});

ipc.on('superscript', () => {
  const formatMenu = nav.select('#gwt-debug-FormattingBar-overflowButton');
  formatMenu.click();
  nav.click('#gwt-debug-FormattingBar-superscriptButton');
});

ipc.on('add-link', () => {
  nav.click('#gwt-debug-FormattingBar-linkButton');
});

ipc.on('add-shortcut', () => {
  nav.click('#gwt-debug-NoteAttributes-shortcutButton');
});

ipc.on('align-center', () => {
  nav.click('#gwt-debug-EditorAlignDropdown-center');
});

ipc.on('align-left', () => {
  nav.click('#gwt-debug-EditorAlignDropdown-left');
});

ipc.on('align-right', () => {
  nav.click('#gwt-debug-EditorAlignDropdown-right');
});

ipc.on('attach-file', () => {
  nav.click('#gwt-debug-FormattingBar-linkButton');
});

ipc.on('bold', () => {
  nav.click('#gwt-debug-FormattingBar-boldButton');
});

ipc.on('bulleted', () => {
  nav.click('#gwt-debug-FormattingBar-bulletButton');
});

ipc.on('checkbox', () => {
  nav.click('#gwt-debug-FormattingBar-checkboxButton');
});

ipc.on('code-block', () => {
  nav.click('#gwt-debug-FormattingBar-codeBlockButton');
});

ipc.on('delete-note', () => {
  nav.click('#gwt-debug-NoteAttributes-trashButton');
});

ipc.on('header-five', () => {
  nav.click('#gwt-debug-FontSizeDropdown-root-TWELVE');
});

ipc.on('header-four', () => {
  nav.click('#gwt-debug-FontSizeDropdown-root-FOURTEEN');
});

ipc.on('header-one', () => {
  nav.click('#gwt-debug-FontSizeDropdown-root-THIRTY_SIX');
});

ipc.on('header-six', () => {
  nav.click('#gwt-debug-FontSizeDropdown-root-TEN');
});

ipc.on('header-three', () => {
  nav.click('#gwt-debug-FontSizeDropdown-root-EIGHTEEN');
});

ipc.on('header-two', () => {
  nav.click('#gwt-debug-FontSizeDropdown-root-TWENTY_FOUR');
});

ipc.on('horizontal-rule', () => {
  nav.click('#gwt-debug-FormattingBar-horizontalRuleButton');
});

ipc.on('indent', () => {
  nav.click('#gwt-debug-FormattingBar-indentButton');
});

ipc.on('insert-drive', () => {
  nav.click('#gwt-debug-FormattingBar-attachmentButton');
});

ipc.on('italic', () => {
  nav.click('#gwt-debug-FormattingBar-italicButton');
});

ipc.on('new-note', () => {
  nav.click('#gwt-debug-Sidebar-newNoteButton');
});

ipc.on('numbered', () => {
  nav.click('#gwt-debug-FormattingBar-listButton');
});

ipc.on('outdent', () => {
  nav.click('#gwt-debug-FormattingBar-outdentButton');
});

ipc.on('remove-formatting', () => {
  nav.click('#gwt-debug-FormattingBar-noFormatButton');
});

ipc.on('return', () => {
  nav.click('#gwt-debug-Sidebar-notesButton');
});

ipc.on('search', () => {
  nav.click('#gwt-debug-Sidebar-searchButton');
});

ipc.on('set-reminder', () => {
  nav.click('#gwt-debug-NoteAttributes-reminderButton');
});

ipc.on('shortcuts', () => {
  nav.click('#gwt-debug-Sidebar-shortcutsButton');
});

ipc.on('strikethrough', () => {
  nav.click('#gwt-debug-FormattingBar-strikeButton');
});

ipc.on('toggle-notebooks', () => {
  nav.click('#gwt-debug-Sidebar-notebooksButton');
});

ipc.on('toggle-tags', () => {
  nav.click('#gwt-debug-Sidebar-tagsButton');
});

ipc.on('underline', () => {
  nav.click('#gwt-debug-FormattingBar-underlineButton');
});

document.addEventListener('keydown', e => nav.jumpToNote(e));

document.addEventListener('DOMContentLoaded', () => {
  nav.zoomRestore();

  if (settings.get('autoNightMode')) {
    mode.autoNight();
  }

  nav.sideBar();
  mode.restore();
  mode.autoWritingDirection();
});
