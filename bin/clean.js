'use strict';
const rimraf = require('rimraf');

// Remove compiled & packaged files
rimraf.sync('dist/');
