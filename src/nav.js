'use strict';
const {webFrame} = require('electron');
const {is} = require('./util');
const settings = require('./settings');

class Nav {
  constructor() {
    this._defaultZoomFactor = 1.0;
    this._lowerZoomLimit = 0.7;
    this._noteSelector = '.focus-NotesView-Note';
    this._notesList = '.NotesView-ScrollWindow > div';
    this._notesListSelector = '.NotesView-ScrollWindow';
    this._scrollStep = 110;
    this._selectedNoteSelector = '.focus-NotesView-Note-selected';
    this._upperZoomLimit = 1.3;
    this._zoomStep = 0.05;
  }

  _currentIdx() {
    let currentIdx = 0;

    const selectedNote = document.querySelector(this._selectedNoteSelector);
    const notesArray = document.querySelector(this._notesListSelector).querySelectorAll(this._noteSelector);

    for (let i = 0; i < notesArray.length; i++) {
      if (notesArray[i] === selectedNote) {
        currentIdx = i + 1;
      }
    }

    return currentIdx;
  }

  _scrollUp() {
    const notesScrollbox = document.querySelector(this._notesListSelector);
    notesScrollbox.scrollTop -= this._scrollStep;
  }

  _scrollDown() {
    const notesScrollbox = document.querySelector(this._notesListSelector);
    notesScrollbox.scrollTop += this._scrollStep;
  }

  click(x) {
    document.querySelector(x).click();
  }

  jumpToNote(event) {
    const comboKey = is.darwin ? event.metaKey : event.ctrlKey;

    if (!comboKey) {
      return null;
    }

    const n = parseInt(event.key, 10);

    if (n < 10 && n > 0) {
      this.selectNote(n);
    }
  }

  nextNote() {
    const idx = this._currentIdx();
    this.selectNote(idx + 1);
    this._scrollDown();
  }

  previousNote() {
    const idx = this._currentIdx();
    this.selectNote(idx - 1);
    this._scrollUp();
  }

  select(x) {
    return document.querySelector(x);
  }

  selectNote(index) {
    document.querySelector(this._notesList).children[index].firstChild.firstChild.click();
  }

  sideBar() {
    document.documentElement.classList.toggle('side-bar-hidden', settings.get('sideBarHidden'));

    if (is.darwin) {
      // Macos visual tweak
      document.documentElement.classList.toggle('side-bar-hidden-macos', settings.get('sideBarHidden'));
    }
  }

  zoomIn() {
    const zoomFactor = webFrame.getZoomFactor() + this._zoomStep;

    if (zoomFactor < this._upperZoomLimit) {
      webFrame.setZoomFactor(zoomFactor);
      settings.set('zoomFactor', zoomFactor);
    }
  }

  zoomReset() {
    webFrame.setZoomFactor(this._defaultZoomFactor);
    settings.set('zoomFactor', this._defaultZoomFactor);
  }

  zoomRestore() {
    webFrame.setZoomFactor(settings.get('zoomFactor'));
  }

  zoomOut() {
    const zoomFactor = webFrame.getZoomFactor() - this._zoomStep;

    if (zoomFactor > this._lowerZoomLimit) {
      webFrame.setZoomFactor(zoomFactor);
      settings.set('zoomFactor', zoomFactor);
    }
  }
}

module.exports = new Nav();
