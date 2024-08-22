const { createStore } = Vuex;
import { createStoreConfig } from './store-helper.mjs';
import userModule from './modules/user.mjs';

const plugins = [];
// plugins.push(Vuex.createLogger()); // 不知道为什么不好使，后面再研究
if (window.createPersistedState) { // 如果引入了持久化插件
  console.info("create persisted state to plugin");
  plugins.push(window.createPersistedState());
}

const {storeConfig} = createStoreConfig({
  plugins: plugins,
  state: {
    count: 0
  },
  getters: {
    doubleCount: state => state.count * 2
  },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
   
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
   
  },
  modules: {
    user: userModule
  }
})

const store = createStore(storeConfig);
console.info("store created");
export default store;
