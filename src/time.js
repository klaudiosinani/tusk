'use strict';

class Time {
  date() {
    const _ = new Date();
    return [_.getMonth() + 1, _.getDate(), _.getFullYear()].join('/');
  }

  dateTime() {
    return `${this.date()} ${this.time()}`;
  }

  hours() {
    return new Date().getHours();
  }

  isDaytime() {
    const hs = this.hours();
    return hs < 18 && hs > 6;
  }

  ms(hours) {
    return 1000 * 60 * 60 * parseInt(hours, 10);
  }

  stamp() {
    const _ = new Date();
    return [
      _.getMonth(),
      _.getDay(),
      _.getFullYear(),
      _.getHours(),
      _.getMinutes(),
      _.getSeconds()
    ].join('-');
  }

  time() {
    const _ = new Date();
    return [_.getHours(), _.getMinutes(), _.getSeconds()].join(':');
  }

  transitionSpan() {
    const hs = this.hours();
    return this.isDaytime() ? 18 - hs : (hs < 6 ? 6 - hs : 30 - hs);
  }
}

module.exports = new Time();
