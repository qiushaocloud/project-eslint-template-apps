'use strict';

const path = require('path');
const moduleAlias = require('module-alias');

exports.aliasPathMap = {
  '@enum': path.resolve(__dirname, 'src/enum'),
  '@src': path.resolve(__dirname, 'src')
};

moduleAlias.addAliases(exports.aliasPathMap);

exports.default =  moduleAlias;