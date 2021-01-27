const usersDataKey = "mining_tracker.users";
const currentUserKey = "mining_tracker.user";

/**
 * Model for Users
 */
export default class UserModel {
  constructor() {
    this.users = JSON.parse(localStorage.getItem(usersDataKey)) || [];
    this.currentUser = localStorage.getItem(currentUserKey) || null;
    this.onUserChangeListeners = [];
  }

  _fireNotification(newUser) {
    this.onUserChangeListeners.forEach((listener) => {
      listener(newUser);
    });
  }

  _commit() {
    if (this.currentUser) {
      localStorage.setItem(currentUserKey, this.currentUser);
    } else {
      localStorage.removeItem(currentUserKey);
    }

    localStorage.setItem(usersDataKey, JSON.stringify(this.users));
  }

  /**
   * Adds a new User
   * @param {String} userName the name of the user
   */
  add(userName) {
    if (this.users.indexOf(userName) === -1) {
      this.users.push(userName);
    }
    this._commit();
  }

  /**
   * Deletes a User
   * @param {String} userName the name of the user
   */
  delete(userName) {
    this.users = this.users.filter((item) => item !== userName);
    this._commit();
  }

  /**
   * Determines whether the user exists or not
   * @param {String} userName the name of the user
   */
  exists(userName) {
    return this.users.includes(userName);
  }

  /**
   * returns all users
   */
  getAll() {
    return this.users;
  }

  /**
   * Sets the User specified by the name as the selected user
   * @param {String} userName  the name of the user
   */
  setCurrent(userName) {
    if (this.currentUser !== userName) {
      this.currentUser = userName;
      this._commit();

      this._fireNotification(userName);
    }
  }

  /**
   * Gets the currently selected user
   * @param {String} userName  the name of the user
   */
  getCurrent() {
    return this.currentUser;
  }

  /**
   * Clears the currently selected user
   */
  clearCurrent() {
    this.currentUser = null;
    this._commit();

    this._fireNotification(null);
  }

  registerOnUserChangeListener(callback) {
    this.onUserChangeListeners.push(callback);
  }
}
