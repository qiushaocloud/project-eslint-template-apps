'use strict';

require('../custom-module-alias');
const {VERSIONS, VERSIONSTIME} = require('@enum/version');

// eslint-disable-next-line no-console
console.log('this is app main.ts', {VERSIONS, VERSIONSTIME});

module.exports = {VERSIONS, VERSIONSTIME};