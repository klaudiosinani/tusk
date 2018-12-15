'use strict';
const {Menu} = require('electron');
const {is} = require('./../util');
const app = require('./app');
const edit = require('./edit');
const file = require('./file');
const format = require('./format');
const help = require('./help');
const view = require('./view');
const window = require('./window');

const darwin = [app, file, edit, format, view, window, help];
const rest = [file, edit, format, view, help];

module.exports = Menu.buildFromTemplate(is.darwin ? darwin : rest);
