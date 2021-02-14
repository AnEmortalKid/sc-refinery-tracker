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

  /**
   * Handles the result of clicking the Add User button
   */
  handleAddUser() {
    this.userView.openAddUserModal();
  }

  /**
   * Handles the result of submitting the Add User form
   */
  submitAddUser(userName) {
    // set the newly added user as the current
    this.userModel.add(userName);
    this.userModel.setCurrent(userName);

    this.userView.closeAddUserModal();
    this._renderUsers();
    this.userView.alertUserAdded();
  }

  /**
   * Handles the result of canceling the Add User Modal
   */
  handleAddUserCancel() {
    this.userView.closeAddUserModal();
  }

  /**
   * Handles the result of clicking Remove User
   */
  handleRemoveUser() {
    this.userView.openRemoveUserModal(this.userModel.getCurrent());
  }

  /**
   * Handles the result of confirming user removal
   * @param {String} userName the name of the user to remove
   */
  handleConfirmRemoveUser(userName) {
    this.userModel.delete(userName);
    this.userModel.clearCurrent();

    this.userView.closeRemoveUserModal();
    this.userView.showUsers(
      this.userModel.getAll(),
      this.userModel.getCurrent()
    );
    this.userView.alertUserRemoved();
  }

  /**
   * Handles the result of canceling the Remove User Modal
   */
  handleRemoveUserCancel() {
    this.userView.closeRemoveUserModal();
  }

  /**
   * Handles the result of selecting a user
   * @param {String} userName the selected user
   */
  handleOnUserChange(userName) {
    this.userModel.setCurrent(userName);
    this.userView.updateButtons(userName);
  }
}
