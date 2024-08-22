const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;
const { createPinia } = Pinia;

// 路由配置
const routes = [
  { path: '/', name: 'Home', component: window.loadSfcLoaderComponent('pages/Home.vue'), alias: '/index.html' },
  // { path: '/index.html', redirect: '/' },
  { path: '/login', name: 'Login', component: window.loadSfcLoaderComponent('pages/Login.vue') },
  { path: '/register', name: 'Register', component: window.loadSfcLoaderComponent('pages/Register.vue') },
  { path: '/user-manage-table', name: 'UserManageTable', component: window.loadSfcLoaderComponent('pages/UserManageTable.vue') },
  { path: '/user-manage-list', name: 'UserManageList', component: window.loadSfcLoaderComponent('pages/UserManageList.vue') },
];

const router = createRouter({
  history: createWebHashHistory(), // 使用 hash 路由
  routes
});
window.customVue3SFCLoaderRouter = router; // 设置项目的 router 到 window 对象上，方便 vue3-sfc-loader 进行 moduleCache

const app = createApp({
  components: {App: window.loadSfcLoaderComponent('./App.vue')},
  template: '<App />'
});

const pinia = createPinia();
if (window.PiniaPersistedstatePlugin) { // 如果引入了 pinia-plugin-persistedstate
  console.log('使用 pinia-plugin-persistedstate');
  pinia.use(window.PiniaPersistedstatePlugin.createPersistedState());
}
app.use(pinia); // 使用 pinia
app.use(router);
window.ElementPlus && app.use(window.ElementPlus);

app.mount('#app');