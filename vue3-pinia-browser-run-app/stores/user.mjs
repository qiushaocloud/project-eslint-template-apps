import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const EXPIRE_DURATION = 60 * 60 * 12; // 用户登陆过期时长，单位秒
let userSeq = 0; // auto-increment user id

const findUser = (state, idOrUsername) => state.users.find(user => typeof idOrUsername === 'number' ? user.id === idOrUsername : user.username === idOrUsername);
const findUserIndex = (state, idOrUsername) => state.users.findIndex(user => typeof idOrUsername === 'number' ? user.id === idOrUsername : user.username === idOrUsername);
const getUserByIndex = (state, index) => state.users[index];
const createNoAuthUser = () => ({id: -1, username: "", nickname: "", age: -1, email: "", loginTs: -1, expireDuration: EXPIRE_DURATION});

const vueBrowserRunApp_users = localStorage.getItem('vueBrowserRunApp_users') ? JSON.parse(localStorage.getItem('vueBrowserRunApp_users')) : [
  {id: ++userSeq, username: "user", password: "password", nickname: "userNickname", age: 15, email: "user@example.com"},
  {id: ++userSeq, username: "Alice", password: "AlicePwd", nickname: "AliceNickname", age: 25, email: "alice@example.com"},
  {id: ++userSeq, username: "Bob", password: "BobPwd", nickname: "BobNickname", age: 30, email: "bob@example.com"},
  {id: ++userSeq, username: "Charlie", password: "CharliePwd", nickname: "CharlieNickname", age: 35, email: "charlie@example.com"},
];
vueBrowserRunApp_users.map((item) => {
  if (item.id > userSeq) userSeq = item.id;
});

export const useUserStore = defineStore('user', () => {
  const users = ref(JSON.parse(JSON.stringify(vueBrowserRunApp_users)));
  const authUser = ref(localStorage.getItem('vueBrowserRunApp_authUser') ? JSON.parse(localStorage.getItem('vueBrowserRunApp_authUser')) : createNoAuthUser());

  const authUserNickname = computed(() => authUser.value.nickname);
  const userCount = computed(() => users.value.length);

  const setAuthUser = (payload) => {
    if (!payload || typeof payload !== 'object') {
      localStorage.removeItem('vueBrowserRunApp_authUser');
      authUser.value = createNoAuthUser();
      return;
    }
    const {id, username, nickname, age, email} = payload;
    authUser.value = {id, username, nickname, age, email, loginTs: Date.now(), expireDuration: EXPIRE_DURATION};
    localStorage.setItem('vueBrowserRunApp_authUser', JSON.stringify(authUser.value));
  };

  const addUser = (payload) => {
    const {username, password, nickname, age, email} = payload;
    const user = {id: ++userSeq, username, password, nickname, age, email};
    users.value.push(user);
    localStorage.setItem('vueBrowserRunApp_users', JSON.stringify(users.value));
  };

  const delUser = (idOrUsername) => {
    const userIndex = findUserIndex({users: users.value}, idOrUsername);
    if (userIndex === -1) return;
    const user = getUserByIndex({users: users.value}, userIndex);
    users.value.splice(userIndex, 1); // remove user
    localStorage.setItem('vueBrowserRunApp_users', JSON.stringify(users.value));
    if (authUser.value.id === user.id) {
      localStorage.removeItem('vueBrowserRunApp_authUser');
      authUser.value = createNoAuthUser(); // reset authUser if deleted user is authUser
    }
  };

  const updateUser = (payload) => {
    const {id, username, password, nickname, age, email} = payload;
    const user = findUser({users: users.value}, id !== undefined ? id : username);
    if (!user) return;
    nickname && (user.nickname = nickname);
    password !== undefined && (user.password = password);
    age !== undefined && (user.age = age);
    email !== undefined && (user.email = email);
    localStorage.setItem('vueBrowserRunApp_users', JSON.stringify(users.value));
  };

  return { users, authUser, authUserNickname, userCount, setAuthUser, addUser, delUser, updateUser };
});
