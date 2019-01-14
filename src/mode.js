'use strict';
const nav = require('./nav');
const settings = require('./settings');
const time = require('./time');

class Mode {
  get _colors() {
    return {
      black: 'lightgrey',
      dark: 'lightgrey',
      default: 'black',
      sepia: 'black'
    };
  }

  async _setFontColor(mode) {
    const frame = await this.getNoteFrame();
    const style = document.createElement('style');
    const fontColor = settings.get(`mode.${mode}`) ? this._colors[mode] : this._colors.default;
    style.textContent = `body {color: ${fontColor};}`;
    return frame.contentDocument.head.append(style);
  }

  _toggle(mode) {
    const modes = settings.get('mode');

    Object.keys(modes).forEach(x => {
      settings.set(`mode.${x}`, (x === mode) ? !modes[x] : false);
      document.documentElement.classList.toggle(`${x}-mode`, settings.get(`mode.${x}`));
    });

    this._setFontColor(mode);
  }

  _enableAutoNight() {
    if (time.isDaytime()) {
      this._toggle(null);
    } else if (!settings.get('mode.dark')) {
      this._toggle('dark');
    }

    setTimeout(() => {
      if (settings.get('autoNightMode')) {
        return this._enableAutoNight();
      }
    }, time.ms(time.transitionSpan()));
  }

  _disableAutoNight() {
    this._toggle(null);
  }

  autoNight() {
    return settings.get('autoNightMode') ? this._enableAutoNight() : this._disableAutoNight();
  }

  black() {
    this._toggle('black');
  }

  dark() {
    this._toggle('dark');
  }

  getNoteFrame() {
    return new Promise(resolve => {
      const checkNoteFrame = () => {
        const frame = nav.select('.RichTextArea-entinymce');
        if (frame) {
          resolve(frame);
        }

        setTimeout(checkNoteFrame, 50);
      };

      checkNoteFrame();
    });
  }

  restore() {
    const modes = settings.get('mode');
    Object.keys(modes).forEach(x => {
      if (modes[x]) {
        this._setFontColor(x);
        document.documentElement.classList.toggle(`${x}-mode`, modes[x]);
      }
    });
  }

  async autoWritingDirection() {
    const frame = await this.getNoteFrame();
    frame.contentDocument.body.setAttribute('dir', 'auto');
    document.querySelector('#gwt-debug-NoteTitleView-container').setAttribute('dir', 'auto');
  }

  sepia() {
    this._toggle('sepia');
  }

  toggleFocus() {
    const isFocused = document.querySelector('#gwt-debug-NoteAttributes-focusButton').style.length;

    if (isFocused) {
      return nav.click('#gwt-debug-NoteAttributes-doneButton');
    }

    nav.click('#gwt-debug-NoteAttributes-focusButton');
  }
}

module.exports = new Mode();
