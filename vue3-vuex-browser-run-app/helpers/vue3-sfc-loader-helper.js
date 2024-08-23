(() => {
  // 在这里定义项目用到的别名路径映射
  const aliasPathMap = {
    "@assets/": "assets/",
    "@components/": "components/",
    "@views/": "views/",
    "@helpers/": "helpers/",
    "@services/": "services/",
    "@stores/": "stores/",
    "@libs/": "libs/",
    "@pages/": "pages/",
    "@scss/": "scss/",
    "@webapi/": "webapi/",
    "@/": ""
  }

  const addModules2Cache = (moduleCache) => {
    window.VueRouter && (moduleCache['vue-router'] = window.VueRouter);
    window.Vuex && (moduleCache['vuex'] = window.Vuex);
    window.Pinia && (moduleCache['pinia'] = window.Pinia);
    window.ElementPlus && (moduleCache['element-plus'] = window.ElementPlus);
    window.ElementPlusIconsVue && (moduleCache['@element-plus/icons-vue'] = window.ElementPlusIconsVue);
    window.VueVirtualScroller && (moduleCache['vue-virtual-scroller'] = window.VueVirtualScroller);
		window.customVue3SFCLoaderVuexStore	&& (moduleCache['@vuexstore'] = window.customVue3SFCLoaderVuexStore); // 项目的 vuex store
    window.customVue3SFCLoaderRouter && (moduleCache['@router'] = window.customVue3SFCLoaderRouter); // 项目的 vue router
  }

  // Sass 编译函数
  let sassSyncJsLoadStatus = 0; // 0: 未加载，1: 加载中，2: 已加载，-1: 加载失败
  let sassSyncJsCache = [];
  const loadSassSyncMinJs = () => {
    if (window.Sass && sassSyncJsLoadStatus !== 2) sassSyncJsLoadStatus = 2;
    if (sassSyncJsLoadStatus === 2) return Promise.resolve();
    return new Promise((resolve, reject) => {
      sassSyncJsCache.push([resolve, reject]);
      if (sassSyncJsLoadStatus > 0) return;
      sassSyncJsLoadStatus = 1;
      const script = document.createElement('script');
      // script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.1/sass.sync.min.js';
      script.src = 'libs/sass.sync.min.js';
      script.async = true;
      console.log('start loadSassSyncMinJs')
      script.onload = () => {
        sassSyncJsLoadStatus = 2;
        console.log('loadSassSyncMinJs ok');
        const sassSyncJsCacheTmp = sassSyncJsCache;
        sassSyncJsCache = [];
        sassSyncJsCacheTmp.forEach((item) => item[0]());
      };
      script.onerror = (err) => {
        sassSyncJsLoadStatus = 2;
        console.error('loadSassSyncMinJs catch error:', err);
        const sassSyncJsCacheTmp = sassSyncJsCache;
        sassSyncJsCache = [];
        sassSyncJsCacheTmp.forEach((item) => item[1]());
      }
      document.head.appendChild(script);
    });
  }

  let cacheSassFileContent = {}; // 缓存 sass 文件内容
  let delayCleanCacheSassFileContentTimer = null;
  const loadSassFileContent = (filePath) => {
    if (!filePath) return Promise.resolve('');
    filePath = replaceAliasToPath(filePath, true); // 替换别名
    let pathnameDir = location.pathname.replace(/\/$/, '');
    /\.\w+$/.test(pathnameDir) && (pathnameDir = pathnameDir.substring(0, pathnameDir.lastIndexOf('/'))); // 去掉文件名
    const fileUrl = `${location.origin}${pathnameDir}/${filePath}`;
    delayCleanCacheSassFileContentTimer && clearTimeout(delayCleanCacheSassFileContentTimer);
    delayCleanCacheSassFileContentTimer = setTimeout(() => {
      console.log('loadSassFileContent clean cacheSassFileContent, fileUrls:', Object.keys(cacheSassFileContent));
      cacheSassFileContent = {};
      delayCleanCacheSassFileContentTimer = null;
    }, 1000 * 60 * 2); // 2分钟后清理缓存
    if (cacheSassFileContent[fileUrl]) return Promise.resolve(cacheSassFileContent[fileUrl]);
    console.log('loadSassFileContent fetch fileUrl:', fileUrl);
    return fetch(fileUrl).then(res => res.ok ? res.text() : '').then((fileContent) => {
      if (!fileContent) {
        console.error('loadSassFileContent fetch is failure, fileUrl:', fileUrl);
        return '';
      }
      console.log('loadSassFileContent fetch ok, fileUrl:', fileUrl);
      cacheSassFileContent[fileUrl] = fileContent;
      return fileContent;
    }).catch((error) => {
      console.error('loadSassFileContent catch error:', error, ' ,fileUrl:', fileUrl);
      return '';
    });
  }

  let compileSassSeq = 0; // 编译 sass 的序号
  const compileSass = (scssContent) => {
    if (!scssContent) return Promise.resolve('');
    const currSeq = ++compileSassSeq;
    console.log('start compileSass seq:', currSeq);
    return new Promise((resolve, reject) => {
      loadSassSyncMinJs().then(() => {
        console.log('start compileSass, seq:', currSeq);
        if (!window.Sass) return reject('window.Sass is undefined');
        // 识别scssContent @import 语句，并且加载对应文件内容进行替换
        const importMatchs = scssContent.match(/@import\s+.*;/g);
        const promiseArr = [];
        if (importMatchs && importMatchs.length) {
          for (const importMatchStr of importMatchs) {
            const scssFilePath = importMatchStr.replace(/(@import |;|'|")/g, '');
            promiseArr.push(loadSassFileContent(scssFilePath).then((fileContent) => {
              scssContent = scssContent.replace(importMatchStr, fileContent);
            }));
          }
        }
        Promise.all(promiseArr).then(() => {
          window.Sass.compile(scssContent, result => {
            if (result.status === 0) {
              console.log('compileSass ok, seq:', currSeq);
              resolve(result.text);
            } else {
              console.error('compileSass failure, seq:', currSeq);
              reject(result.formatted);
            }
          });
        });
      }).catch(reject);
    });
  }

  let vueComponentStyleIdSeq = 0;
  const addStyle2UI = (textContent, filePath) => {
    if (!textContent) return;
    const vueComponentStyleId = 'vue-component-style_' + vueComponentStyleIdSeq;

    if (filePath) {
      const style = Object.assign(document.createElement('style'), { textContent });
      console.log('addStyle2UI set data-path:', filePath);
      style.setAttribute('data-path', filePath);
      document.head.appendChild(style);
      if (document.getElementById(vueComponentStyleId)) vueComponentStyleIdSeq++; // 插入的是样式文件的样式，需要递增 vueComponentStyleIdSeq
      return;
    }

    const vueComponentStyle = document.getElementById(vueComponentStyleId);
    if (!vueComponentStyle) {
      console.log('addStyle2UI create vueComponentStyle id:', vueComponentStyleId);
      const style = Object.assign(document.createElement('style'), { textContent });
      style.id = vueComponentStyleId;
      document.head.appendChild(style);
      return;
    }

    vueComponentStyle.innerHTML += textContent; // 追加到 vueComponentStyle 内容后
  }

  const replaceAliasToPath = (content, isFilePath) => {
    for (const key in aliasPathMap) {
      const value = aliasPathMap[key];
      if (/\/$/.test(value)) {
        if (isFilePath) {
          content = content.replace(new RegExp('^'+key, ''), value);
          continue;
        }
        content = content.replace(new RegExp('\''+key, 'g'), '\''+value).replace(new RegExp('\"'+key, 'g'), '\"'+value).replace(new RegExp('url\\('+key, 'g'), 'url('+value);
      } else {
        if (isFilePath) {
          content = content.replace(new RegExp('^'+key+'$', ''), value);
          continue;
        }
        content = content.replace(new RegExp('\''+key+'\'', 'g'), '\''+value+'\'').replace(new RegExp('\"'+key+'\"', 'g'), '\"'+value+'\"').replace(new RegExp('url\\('+key+'\\)', 'g'), 'url('+value+')');
      }
    }
    return content;
  }

  // 封装按顺序的 fetch 函数
  const awaitRequests = []; // 请求队列, [{url, resolve, reject}]
  let isRequesting = false; // 是否正在请求中
  const _fetchSequential = () => {
    const cacheReq = awaitRequests.shift();
    if (!cacheReq) return;
    const {url, resolve, reject} = cacheReq;
    // 开始请求
    isRequesting = true;
    console.log('fetchSequential start fetch url:', url);
    fetch(url).then(res => {
      console.log('fetchSequential fetch ok, url:', url);
      isRequesting = false;
      resolve && resolve(res);
    }).catch((err) => {
      console.error('fetchSequential catch error:', err, ' ,url:', url);
      isRequesting = false;
      reject && reject(err);
    }).finally(() => {
      if (awaitRequests.length > 0) _fetchSequential(); // 如果有请求队列，则开始下一个请求
    });
  }

  const fetchSequential = (url) => {
    return new Promise((resolve, reject) => {
      console.log('fetchSequential add fetch url to cache, url:', url, ' ,isRequesting:', isRequesting);
      awaitRequests.push({url, resolve, reject});
      if (!isRequesting && awaitRequests.length > 0) _fetchSequential(); // 如果没有请求中，且有请求队列，则开始下一个请求
    });
  }

  window.getSfcLoaderOptions = () => {
    if (!window.Vue) throw new Error('window.Vue is undefined, please load vue.js script file');
    const moduleCache = {vue: window.Vue};
    addModules2Cache(moduleCache);

    const options = {
      moduleCache: moduleCache,
      getFile: (url) => {
        if (/^(scss|sass|css)$/.test(url)) return ''; // vue style 设置了 lang="scss" 会导致下载 scss 文件，这里 忽略 scss/sass 请求
        console.log('getFile start replaceAliasToPath url:', url);
        url = replaceAliasToPath(url, true); // 替换别名
        console.log('getFile end replaceAliasToPath url:', url);
        if (/\.(jpg|jpeg|png|gif|bmp|webp)(?:\?.*)?$/.test(url) && !/\?.*format_type=(binary|blob|base64)/.test(url)) return ''; // 如果是图片，则直接返回空字符串
        if (/\.svg(?:\?.*)?$/.test(url) && !/\?.*format_type=content/.test(url)) return ''; // 如果是svg，则直接返回空字符串

        return new Promise((resolve, reject) => {
          console.log('getFile start fetch url:', url);
          (/\.(css|sass|scss)(?:\?.*)?$/.test(url) ? fetchSequential(url) : fetch(url)).then(res => {
            if (!res.ok) {
              console.error('getFile fetch error:', res.statusText, ' ,url:', url);
              reject(new Error('getFile fetch not ok, statusText:'+ res.statusText + ' ' + url));
            } else {
              console.log('getFile fetch ok, url:', url);
              const result = {};

              if (/\.js(?:\?.*)?$/.test(url) && !/\?.*format_type=javascript/.test(url)) { // 如果是 js 文件，则需要处理成 module，返回成 mjs
                result.type = '.mjs';
              }

              result.getContentData = (asBinary) => {
                if (asBinary) return res.arrayBuffer();
                return res.text().then((fileContent) => {
                  if (/\.(vue|css|sass|scss|js)(?:\?.*)?$/.test(url)) { // 这些文件都需要替换别名
                    fileContent = replaceAliasToPath(fileContent);
                  }

                  if (/\.vue(?:\?.*)?$/.test(url)) { // vue 文件
                    const scssMatches = fileContent.match(/<style(?:\s+scoped)? lang=('|")(scss|sass)('|")(?:\s+scoped)?(?: +)?>([\s\S]*?)<\/style>/g);
                    if (scssMatches && Array.isArray(scssMatches) && scssMatches.length > 0) { // 找到 .vue 文件中的 scss/sass 代码进行编译
                      const proArr = [];
                      scssMatches.forEach((scssMatchStr) => {
                        const scssMatchResult = scssMatchStr.match(/<style(?:\s+scoped)? lang=('|")(scss|sass)('|")(?:\s+scoped)?(?: +)?>([\s\S]*?)<\/style>/);
                        if (scssMatchResult && Array.isArray(scssMatchResult) && scssMatchResult.length > 0) {
                          const scssContent = scssMatchResult[scssMatchResult.length - 1];
                          proArr.push(compileSass(scssContent).then((cssContent) => {
                            fileContent = fileContent.replace(scssMatchStr, scssMatchStr.replace(scssContent, cssContent).replace(/ lang=('|")(scss|sass)('|")/, ''));
                          }));
                        }
                      })
                      return Promise.all(proArr).then(() => fileContent); // 等待所有 scss/sass 编译完成后，再返回 vue 文件内容
                    }
                  }

                  return fileContent;
                });
              };

              resolve(result);
            }
          }).catch((err) => {
            console.error('getFile catch error:', err, ' ,url:', url);
            reject(err);
          });
        })
      },
      addStyle: (textContent) => addStyle2UI(textContent),
      handleModule: (type, getContentData, path) => {
        console.log('handleModule type:', type, ' ,path:', path);
        return new Promise((resolve, reject) => {
          if (/^(scss|sass|css)$/.test(path)) return resolve(''); // vue style 设置了 lang="scss" 会导致下载 scss 文件，这里 忽略 scss/sass 请求
          if (/^\.(jpg|jpeg|png|gif|bmp|webp)$/.test(type)) { // 图片文件
            if (/\?.*format_type=binary/.test(path)) return getContentData(true).then(resolve).catch(reject); // 图片且格式化类型为二进制，则直接返回二进制数据
            if (/\?.*format_type=blob/.test(path)) { // 图片且格式化类型为 blob，则返回图片的 blobUrl
              return getContentData(true).then((binaryData) => {
                const pngBlobUrl = URL.createObjectURL(new Blob([binaryData]));
                return resolve(pngBlobUrl);
              }).catch(reject);
            }
            if (/\?.*format_type=base64/.test(path)) { // 图片且格式化类型为 base64，则返回图片的 base64 编码
              return getContentData(true).then((binaryData) => {
                const base64Data = btoa(new Uint8Array(binaryData).reduce((binary, byte) => binary + String.fromCharCode(byte), ''));
                return resolve('data:image/'+type.replace(/^\./, '')+';base64,' + base64Data);
              }).catch(reject);
            }
            return resolve(path); // 直接返回图片相对 root 的路径
          }

          if (/^\.svg$/.test(type)) { // svg 文件
            if (/\?.*format_type=content/.test(path)) { // svg且格式化类型为 content，则返回svg内容
              return getContentData().then(resolve).catch(reject);
            }
            return resolve(path); // 直接返回svg相对 root 的路径
          }

          switch (type) {
            case '.css':
            case '.sass':
            case '.scss': {
              return getContentData().then((fileContent) => {
                if (type === '.sass' || type === '.scss') { // scss/sass 文件
                  return compileSass(fileContent).then((cssContent) => {
                    addStyle2UI(cssContent, path);
                    return '';
                  });
                } else if (type === '.css') { // css 文件
                  addStyle2UI(fileContent, path);
                  return '';
                }
                return fileContent;
              }).then(resolve).catch(reject); 
            }
          }
 
          resolve();
        });
      }
    }

    return options;
  }

  window.loadSfcLoaderComponent = (componentPath) => {
    const { loadModule } = window['vue3-sfc-loader'];
    const asyncComponent = window.Vue.defineAsyncComponent(() => loadModule(componentPath, window.getSfcLoaderOptions()));
    return asyncComponent;
  }
})();
