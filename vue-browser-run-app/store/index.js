const { createStore } = Vuex;
// const { createStore, createLogger } = Vuex;

const store = createStore({
  // plugins: [createLogger()],
  state: {
    disabledUserAuthCheck: false,
    authUserInfo: {
      id: -1,
      username: '',
      role: '',
      loginTs: -1
    },
    // count: 0,
    // users: [{id: 1, name: "Alice"}]
  },
  getters: {
    // getCount: (state) => state.count,
    // getUser: (state, id) => {
    //   return state.users.find(user => user.id === id);
    // },
    // getUsers: state => state.users
  },
  mutations: {
    setDisabledUserAuthCheck(state, isDisabled) {
      state.disabledUserAuthCheck = isDisabled;
    },
    setAuthUserInfo(state, userInfo) {
      state.authUserInfo = {...userInfo};
    }
    // increment(state) {
    //   state.count++;
    // },
    // addUser(state, user) {
    //   state.users.push(user);
    // },
    // setUsers(state, users){
    //   state.users = users;
    // }
  },
  actions: {
    setDisabledUserAuthCheck({ commit }, isDisabled) {
      commit('setDisabledUserAuthCheck', isDisabled);
    },
    setAuthUserInfo({ commit }, userInfo) {
      commit('setAuthUserInfo', userInfo);
    }
    // increment({ commit }) {
    //   commit('increment');
    // },
    // addUser({ commit }, user) {
    //   commit('addUser', user);
    // }
  },
  modules: {},
})

window.customAppStore = store;
console.info("store created")
export default store;
