import '@helpers/testLog';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import store from '@storets';
import Router from '@pages/Router';
import '@styles/app.less';
import '@styles/less-test-demo.less';
import '@styles/scss-test-demo.scss';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
// v18 的新方法
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>,
);