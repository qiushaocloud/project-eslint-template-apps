/* eslint-disable no-console */
import '@qiushaocloud/qesm-nodejs-adapter';
import {VERSIONS, VERSIONSTIME} from '#enum/version.mjs';

const __dirname = global.getImportDirName(import.meta.url);
const __filename = global.getImportFileName(import.meta.url);

// 在模块中可以全局使用 __filename 和 __dirname 了
console.log('__filename:', __filename);
console.log('__dirname:', __dirname);

console.log('this is app main.ts', {VERSIONS, VERSIONSTIME});

export {VERSIONS, VERSIONSTIME};