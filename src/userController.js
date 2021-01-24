const usersDataKey = "mining_tracker.users";
const currentUserKey = "mining_tracker.user";

export default class UserController {
  constructor() {
    var userData = localStorage.getItem(usersDataKey);
    if (userData) {
      this.users = JSON.parse(userData);
    } else {
      this.users = [];
    }

    this.user = localStorage.getItem(currentUserKey) || null;

    this.onUserChangeListeners = [];

    // TODO on startup, do a load();
  }

  storeUser(userName) {
    this.users.push(userName);
    localStorage.setItem(usersDataKey, JSON.stringify(this.users));
  }

  hasUser(userName) {
    return this.users.includes(userName);
  }

  setUser(userName) {
    this.user = userName;
    localStorage.setItem(currentUserKey, userName);

    this.onUserChangeListeners.forEach((listener) => {
      listener(userName);
    });
  }

  removeUser(userName) {
    const index = this.users.indexOf(userName);
    if (index > -1) {
      this.users.splice(index, 1);
    }
    localStorage.setItem(usersDataKey, JSON.stringify(this.users));
    // clear out
    localStorage.removeItem(currentUserKey);
    this.user = null;
  }

  getCurrentUser() {
    return this.user;
  }

  getUsers() {
    return this.users;
  }

  registerOnUserChangeListener(callback) {
    this.onUserChangeListeners.push(callback);
  }
}
