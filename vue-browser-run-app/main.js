const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;
import store from './store/index.js';

// 路由配置
const routes = [
  { path: '/', name: 'Home', component: window.loadSfcLoaderComponent('pages/Home.vue'), alias: '/index.html' },
  // { path: '/index.html', redirect: '/' },
  { path: '/login', name: 'Login', component: window.loadSfcLoaderComponent('pages/Login.vue') },
  { path: '/register', name: 'Register', component: window.loadSfcLoaderComponent('pages/Register.vue') },
  { path: '/page1', name: 'Page1', component: window.loadSfcLoaderComponent('pages/Page1.vue') },
  { path: '/page2', name: 'Page2', component: window.loadSfcLoaderComponent('pages/Page2.vue') }
];

const router = createRouter({
  history: createWebHashHistory(), // 使用 hash 路由
  routes
});

const app = createApp({
  components: {App: window.loadSfcLoaderComponent('./App.vue')},
  template: '<App />'
});
app.use(store); 
app.use(router);
app.use(ElementPlus);
app.mount('#app');