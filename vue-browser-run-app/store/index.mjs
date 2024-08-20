const { createStore } = Vuex;
// const { createStore, createLogger } = Vuex;
import { createStoreConfig } from './store-helper.mjs';
import userModule from './modules/user.mjs';

const {storeConfig} = createStoreConfig({
  // plugins: [createLogger()],
  state: {
    count: 0,
  },
  getters: {},
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
