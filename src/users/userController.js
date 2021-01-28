export default class UserController {
  constructor(userModel, userView) {
    this.userModel = userModel;
    this.userView = userView;

    this.userView.bindAddUser(this.handleAddUser.bind(this));
    this.userView.bindConfirmAddUser(this.submitAddUser.bind(this));
    this.userView.bindCancelAddUserForm(this.handleAddUserCancel.bind(this));

    this.userView.bindRemoveUser(this.handleRemoveUser.bind(this));
    this.userView.bindConfirmRemoveUser(
      this.handleConfirmRemoveUser.bind(this)
    );
    this.userView.bindCancelRemoveUser(this.handleRemoveUserCancel.bind(this));
    this.userView.bindOnUserChange(this.handleOnUserChange.bind(this));

    this._renderUsers();
  }

  _renderUsers() {
    this.userView.showUsers(
      this.userModel.getAll(),
      this.userModel.getCurrent()
    );
  }

  handleAddUser() {
    this.userView.openAddUserModal();
  }

  submitAddUser(data) {
    var userName = data["username"];

    // set the newly added user as the current
    this.userModel.add(userName);
    this.userModel.setCurrent(userName);

    this.userView.closeAddUserModal();
    this._renderUsers();
  }

  handleAddUserCancel() {
    this.userView.closeAddUserModal();
  }

  handleRemoveUser() {
    this.userView.openRemoveUserModal();
  }

  handleConfirmRemoveUser(userName) {
    this.userModel.delete(userName);
    this.userModel.clearCurrent();

    this.userView.closeRemoveUserModal();
    this.userView.showUsers(
      this.userModel.getAll(),
      this.userModel.getCurrent()
    );
  }

  handleRemoveUserCancel() {
    this.userView.closeRemoveUserModal();
  }

  handleOnUserChange(userName) {
    this.userModel.setCurrent(userName);
    this.userView.updateButtons(userName);
  }
}
