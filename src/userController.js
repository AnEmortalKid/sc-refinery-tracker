export default class UserController {
  constructor(userModel) {
    this.userModel = userModel;
    // TODO on startup, do a load();
  }

  storeUser(userName) {
    this.userModel.add(userName);
  }

  hasUser(userName) {
    return this.userModel.exists(userName);
  }

  setUser(userName) {
    this.userModel.setCurrent(userName);
  }

  removeUser(userName) {
    var current = this.userModel.getCurrent();
    this.userModel.delete(userName);
    if (userName === current) {
      this.userModel.clearCurrent();
    }
  }

  getCurrentUser() {
    return this.userModel.getCurrent();
  }

  getUsers() {
    return this.userModel.getAll();
  }
}
