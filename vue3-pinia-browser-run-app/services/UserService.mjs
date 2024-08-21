import { useUserStore } from '@stores/user.mjs';

class UserService {
  constructor() {
    if (UserService.instance) return UserService.instance;
    this._userStore = useUserStore();
    UserService.instance = this;
  }

  get users () {
    return this._userStore.users;
  }

  getUser (idOrUsername) {
    return this.users.find(user => typeof idOrUsername === 'number' ? user.id === idOrUsername : user.username === idOrUsername);
  }

  getUserIndex (idOrUsername) {
    return this.users.findIndex(user => typeof idOrUsername === 'number' ? user.id === idOrUsername : user.username === idOrUsername);
  }

  getUserByIndex (index) {
    return this.users[index];
  }

  getAuthUser (isAllowUndefined = false) {
    if (isAllowUndefined) {
      const authUser = this._userStore.authUser;
      return authUser.username ? authUser : undefined;
    }
    return this._userStore.authUser;
  }

  userLogin (username, password) {
    const user = this.getUser(username);
    if (!user || user.password !== password) return false;
    this._userStore.setAuthUser(user);
    return true;
  }

  userLogout () {
    if (!this.getAuthUser()) return false;
    this._userStore.setAuthUser(null);
    return true;
  }

  deleteInvalidAuthUser () {
    const authUser = this.getAuthUser(true);
    if (!authUser) return false;
    if (this.checkAuthValid()) return false;
    this._userStore.setAuthUser(null);
    return true;
  }

  checkAuthValid () {
    const authUser = this.getAuthUser(true);
    if (!authUser) return false;
    const now = new Date().getTime();
    const {loginTs, expireDuration} = authUser;
    if (now - loginTs > (expireDuration * 1000)) return false;
    return true;
  }
}

export default new UserService();