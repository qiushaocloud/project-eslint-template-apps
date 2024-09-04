const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;
import store from './stores/index.mjs';
window.customVue3SFCLoaderVuexStore = store; // 设置项目的 store 到 window 对象上，方便 vue3-sfc-loader 进行 moduleCache

// 路由配置
const routes = [
  { path: '/', name: 'Home', component: window.loadSfcLoaderComponent('pages/Home.vue'), alias: '/index.html' },
  // { path: '/index.html', redirect: '/' },
  { path: '/login', name: 'Login', component: window.loadSfcLoaderComponent('pages/Login.vue') },
  { path: '/register', name: 'Register', component: window.loadSfcLoaderComponent('pages/Register.vue') },
  { path: '/user-manage-table', name: 'UserManageTable', component: window.loadSfcLoaderComponent('pages/UserManageTable.vue') },
  { path: '/user-manage-list', name: 'UserManageList', component: window.loadSfcLoaderComponent('pages/UserManageList.vue') },
  { path: '/test-echarts', name: 'TestEcharts', component: window.loadSfcLoaderComponent('pages/TestECharts.vue') }
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
app.use(store); 
app.use(router);
window.ElementPlus && app.use(window.ElementPlus, window.ElementPlusLocaleZhCn ? { locale: window.ElementPlusLocaleZhCn } : undefined); // 使用 element-plus 组件库
window.VueECharts && app.component('v-chart', window.VueECharts); // 注册 vue-echarts 组件，使用参考： https://echarts.apache.org/examples/zh/index.html

app.mount('#app');