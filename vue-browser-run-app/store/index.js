const { createStore } = Vuex;
// const { createStore, createLogger } = Vuex;

let userSeq = 4;
const storeConfig = {
  // plugins: [createLogger()],
  state: {
    count: 0,
  	users: [
    	{id: 1, name: "Alice", age: 25, email: "alice@example.com"},
    	{id: 2, name: "Bob", age: 30, email: "bob@example.com"},
    	{id: 3, name: "Charlie", age: 35, email: "charlie@example.com"}
  	],
    authUser: {id: -1, name: "", age: -1, email: ""}
  },
  getters: {
    getCount: (state) => state.count,
    getUser: (state, id) => state.users.find(user => user.id === id),
    getUsers: state => state.users,
    getAuthUser: state => state.authUser
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit('increment');
    },
  },
  modules: {}
}

const addSyncMutationAndAction = (mutationName, mutationHandle) => {
	storeConfig.mutations[mutationName] = mutationHandle;
  storeConfig.actions[mutationName] = ({ commit }, payload) => commit(mutationHandle, payload);
}

addSyncMutationAndAction('addUser', (state, payload) => {
  const {name, age, email} = payload;
  const user = {id: ++userSeq, name, age, email};
  state.users.push(user);
});

addSyncMutationAndAction('setAuthUser', (state, payload) => {
	if (!payload || typeof payload !== 'object') return state.authUser = {id: -1, name: "", age: -1, email: ""};
  state.authUser = {...payload};
});

const store = createStore(storeConfig);
console.info("store created");
export default store;
