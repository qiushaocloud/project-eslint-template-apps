export const createStoreModule = ({state, getters, mutations, actions} = {}) => {
  const storeModule = {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {}
  }

  state && (storeModule.state = state);
  getters && (storeModule.getters = getters);
  mutations && (storeModule.mutations = mutations);
  actions && (storeModule.actions = actions);

  const addSyncMutationAndAction = (mutationName, mutationHandle) => {
    storeModule.mutations[mutationName.toUpperCase()] = mutationHandle;
    storeModule.actions[mutationName] = ({ commit }, payload) => commit(mutationName.toUpperCase(), payload);
  }
  
  return {storeModule, addSyncMutationAndAction};
}

export const createStoreConfig = ({state, getters, mutations, actions, modules, plugins} = {}) => {
  const {storeModule, addSyncMutationAndAction} = createStoreModule({state, getters, mutations, actions});
  const storeConfig = storeModule;
  delete storeConfig.namespaced; // remove namespaced
  storeConfig.modules = modules || {};
  plugins && (storeConfig.plugins = plugins);
  return {storeConfig, addSyncMutationAndAction};
}