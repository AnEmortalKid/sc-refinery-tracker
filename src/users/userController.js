export default class UserController {
  constructor(userModel, userView) {
    this.userModel = userModel;
    this.userView = userView;

    this.userView.bindAddUser(this.handleAddUser.bind(this));
    this.userView.bindConfirmAddUser(this.submitAddUser.bind(this));

    this.userView.bindRemoveUser(this.handleRemoveUser.bind(this));

    this.userView.bindOnUserChange(this.handleOnUserChange.bind(this));

    // TODO on startup, do a load();
  }

  handleAddUser() {
    app.controls.openModal("add-user-form-modal");
  }

  submitAddUser(userName) {
    this.userModel.add(userName);
    // set the newly added user as the current
    this.userModel.setCurrent(userName);

    app.controls.closeModal("add-user-form-modal");
    // downstream layout
  }

  handleRemoveUser() {
    app.controls.openModal("remove-user-form-modal");
  }

  handleOnUserChange(userName) {
    console.log(`user:${userName}`);
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
