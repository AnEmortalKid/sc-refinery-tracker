const usersDataKey = "mining_tracker.users";
const currentUserKey = "mining_tracker.user";

/**
 * Model for Users
 */
export default class UserModel {
  constructor() {
    this.users = JSON.parse(localStorage.getItem(usersDataKey)) || [];
    this.user = localStorage.getItem(currentUserKey) || null;
    this.onUserChangeListeners = [];
  }

  _commit() {
    if (this.user) {
      localStorage.setItem(currentUserKey, this.user);
    } else {
      localStorage.clear(currentUserKey);
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
    this.users = this.users.filter(item => item !== userName);
    this._commit();
  }

  /**
   * Determines whether the user exists or not
   * @param {String} userName the name of the user
   */
  exists(userName) {}

  /**
   * Sets the User specified by the name as the selected user
   * @param {String} userName  the name of the user
   */
  setCurrent(userName) {}

  /**
   * Gets the currently selected user
   * @param {String} userName  the name of the user
   */
  getCurrent() {}

  /**
   * Clears the currently selected user
   */
  clearCurrent() {}

  registerOnUserChangeListener(callback) {
    this.onUserChangeListeners.push(callback);
  }
}
