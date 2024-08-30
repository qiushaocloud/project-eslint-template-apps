import { createStoreModule } from '../store-helper.mjs';

const EXPIRE_DURATION = 60 * 60 * 12; // 用户登陆过期时长，单位秒

const findUser = (state, idOrUsername) => state.users.find(user => typeof idOrUsername === 'number' ? user.id === idOrUsername : user.username === idOrUsername);
const findUserIndex = (state, idOrUsername) => state.users.findIndex(user => typeof idOrUsername === 'number' ? user.id === idOrUsername : user.username === idOrUsername);
const getUserByIndex = (state, index) => state.users[index];
const createNoAuthUser = () => ({id: -1, username: "", nickname: "", age: -1, email: "", loginTs: -1, expireDuration: EXPIRE_DURATION});

const {storeModule: userModule, addSyncMutationAndAction} = createStoreModule({
  state: {
    userSeq: 5,
    users: [
      {id: 1, username: "user", password: "password", nickname: "userNickname", age: 15, email: "user@example.com"},
      {id: 2, username: "Alice", password: "AlicePwd", nickname: "AliceNickname", age: 25, email: "alice@example.com"},
      {id: 3, username: "Bob", password: "BobPwd", nickname: "BobNickname", age: 30, email: "bob@example.com"},
      {id: 4, username: "Charlie", password: "CharliePwd", nickname: "CharlieNickname", age: 35, email: "charlie@example.com"},
    ],
    authUser: localStorage.getItem('vueBrowserRunApp_authUser') ? JSON.parse(localStorage.getItem('vueBrowserRunApp_authUser')) : createNoAuthUser()
  },
  getters: {
    authUserNickname: state => state.authUser.nickname,
    userCount: state => state.users.length,
  },
  mutations: {},
  actions: {}
});

addSyncMutationAndAction('setAuthUser', (state, payload) => {
	if (!payload || typeof payload !== 'object') {
    localStorage.removeItem('vueBrowserRunApp_authUser');
    return state.authUser = createNoAuthUser();
  }
  const {id, username, nickname, age, email} = payload;
  state.authUser = {id, username, nickname, age, email, loginTs: Date.now(), expireDuration: EXPIRE_DURATION};
  localStorage.setItem('vueBrowserRunApp_authUser', JSON.stringify(state.authUser));
});

addSyncMutationAndAction('addUser', (state, payload) => {
  const {username, password, nickname, age, email} = payload;
  const user = {id: ++state.userSeq, username, password, nickname, age, email};
  state.users.push(user);
});

addSyncMutationAndAction('delUser', (state, idOrUsername) => {
  const userIndex = findUserIndex(state, idOrUsername);
  if (userIndex === -1) return;
  const user = getUserByIndex(state, userIndex);
  state.users.splice(userIndex, 1); // remove user
  if (state.authUser.id === user.id) {
    localStorage.removeItem('vueBrowserRunApp_authUser');
    state.authUser = createNoAuthUser(); // reset authUser if deleted user is authUser
  }
});

addSyncMutationAndAction('updateUser', (state, payload) => {
  const {id, username, password, nickname, age, email} = payload;
  const user = findUser(state, id !== undefined ? id : username);
  if (!user) return;
  nickname && (user.nickname = nickname);
  password !== undefined && (user.password = password);
  age !== undefined && (user.age = age);
  email !== undefined && (user.email = email);
});

export default userModule;