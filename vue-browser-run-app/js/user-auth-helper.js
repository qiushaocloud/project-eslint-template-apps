(() => {
  const customAtob = (str) => {
    str = str.slice(9, -4); // 去掉开头和结尾的随机字符
    let newStr = '';
    // 去掉随机字符
    for (let i = 0; i < str.length; i++) {
      newStr += str.charAt(i);
      if (i % 2 === 0 || i % 5 === 0 || i % 11 === 0) { // str 去掉下一个字符
        str = str.slice(0, i) + str.slice(i + 1);
      }
    }
    return atob(newStr);
  }

  const getCookie = (cname) => {
    if (!document.cookie) return "";
    const name = `${cname}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
  };

  const getAuthorization = () => {
    let authorization = getCookie('Authorization');
    if (!authorization) authorization = window.localStorage.getItem('LogUploadLoginAuthorization');
    authorization && (authorization = window.decodeURIComponent(authorization));
    return authorization;
  };

  const checkAuthValidByJson = (ahthJson) => {
    let isValid = false;
    try {
      if (typeof ahthJson === 'object' && ahthJson.loginTs && ahthJson.expireDuration) {
        const now = Date.now();
        const expireTs = ahthJson.loginTs + ahthJson.expireDuration;
        if (now < expireTs) isValid = true;
      }
    } catch (error) {
      console.error('checkAuthValidByJson catch error:', error, 'ahthJson:', ahthJson);
    }
    return isValid;
  };

  const parseAuthorization = (authorization) => {
    let id = -1;
    let username = '';
    let role = '';
    let loginTs = -1;
    let expireDuration = -1;
    let signature = '';

    try {
      if (authorization) {
        const tokenBase64 = authorization.replace('Bearer ', '');
        const token = customAtob(tokenBase64); // decode base64，Examples: "username:loginTs:expireTs:signature"
        id = token.split(':')[0]; // ID
        username = token.split(':')[1]; // 用户名
        role = token.split(':')[2]; // 角色
        loginTs = Number(token.split(':')[3]); // 登录时间戳
        expireDuration = Number(token.split(':')[4]); // 过期时长，单位：毫秒
        signature = token.split(':')[6]; // 签名
      }
    } catch (error) {
      console.error('parseAuthorization catch error:', error, 'authorization:', authorization);
    }

    return {
      authorization,
      id,
      username,
      role,
      loginTs,
      expireDuration,
      signature
    };
  };

  let authorization;
  let authorizationJson;
  window.checkUserAuthValid = (isForceUpdate) => {
    if (!authorization || isForceUpdate) {
      authorization = getAuthorization();
      authorizationJson = parseAuthorization(authorization);
    }

    const isAuthValid = checkAuthValidByJson(authorizationJson);
    return isAuthValid;
  };

  window.getAuthUserInfo = () => {
    authorization = getAuthorization();
    authorizationJson = parseAuthorization(authorization);
    const isAuthValid = checkAuthValidByJson(authorizationJson);
    if (!isAuthValid) return {id: -1, username: '', role: '', loginTs: -1};
    const {id, username, role, loginTs} = authorizationJson;
    return {id, username, role, loginTs};
  }

  let checkUserAuthTimer;
  let oldAuthorization;
  let oldIsAuthValid;
  window.startIntervalCheckUserAuth = (onCallback, opts) => {
    oldIsAuthValid = undefined;
    oldAuthorization = undefined;
    if (opts && opts.firstForceUpdate) {
      authorization = getAuthorization();
      authorizationJson = parseAuthorization(authorization);
    }
    const intervalCheckAuth = () => {
      if (!authorization || (opts && opts.isForceUpdate)) {
        authorization = getAuthorization();
        authorizationJson = parseAuthorization(authorization);
      }
      const isAuthValid = checkAuthValidByJson(authorizationJson);
      if (oldAuthorization === authorization && isAuthValid === oldIsAuthValid) return;
      oldAuthorization = authorization;
      oldIsAuthValid = isAuthValid;
      console.log('intervalCheckUserAuth isAuthValid:', isAuthValid);
      typeof onCallback === 'function' && onCallback(isAuthValid);
    }

    intervalCheckAuth(); // run first time
    checkUserAuthTimer && clearInterval(checkUserAuthTimer);
    checkUserAuthTimer = setInterval(intervalCheckAuth, (opts && opts.interval) || 5000);
  }
  window.stopIntervalCheckUserAuth = (isForceUpdate) => {
    checkUserAuthTimer && clearInterval(checkUserAuthTimer);
    checkUserAuthTimer = undefined;
    window.cleanCacheIntervalOldUserAuth(isForceUpdate);
  }
  window.cleanCacheIntervalOldUserAuth = (isForceUpdate) => {
    oldIsAuthValid = undefined;
    oldAuthorization = undefined;
    if (isForceUpdate) {
      authorization = getAuthorization();
      authorizationJson = parseAuthorization(authorization);
    }
  }
})();
