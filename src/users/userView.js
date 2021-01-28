const selectorId = "user-selection";

import { removeChildren } from "../elementUtils";

function createPlaceholder() {
  // <option value="" disabled selected>No users available. Create a new User.</option>
  var option = document.createElement("option");
  option.value = "";
  option.disabled = true;
  option.selected = true;
  option.text = "Select or Create a User.";
  return option;
}

export default class UserView {
  constructor() {
    this.addUserForm = document.getElementById("user-form");

    this.addUserInput = document.getElementById("user-form-username");
    this.userSelect = document.getElementById("user-selection");
  }

  /**
   * Binds the event of clicking the Add User  button
   * @param {function} handler a handler to invoke when the add user button is pressed
   */
  bindAddUser(handler) {
    var action = (event) => {
      handler();
    };

    var btn = document.getElementById("add-user-btn");
    btn.addEventListener("click", action);
  }

  /**
   * Binds the event of confirming the Add User modal
   * @param {function} handler a handler to invoke when the confirmation button to add a user is pressed
   */
  bindConfirmAddUser(handler) {
    var submissionAction = (event) => {
      event.preventDefault();
      handler(this.addUserInput.value);
    };

    this.addUserForm.addEventListener("submit", submissionAction);
    var btn = document.getElementById("add-user-form-confirm-btn");
    btn.addEventListener("click", submissionAction);
  }

  /**
   * Binds the event of canceling the Add User modal
   * @param {function} handler a handler to invoke when the cancel button on the add user form
   */
  bindCancelAddUserForm(handler) {
    var cancelAction = (event) => {
      event.preventDefault();
      handler();
    };

    var cancelBtn = document.getElementById("add-user-form-cancel-btn");
    cancelBtn.addEventListener("click", cancelAction);
    var xBtn = document.getElementById("add-user-modal-close-button");
    xBtn.addEventListener("click", cancelAction);
  }

  /**
   * Binds the event of clicking the Remove User  button
   * @param {function} handler a handler to invoke when the add user button is pressed
   */
  bindRemoveUser(handler) {
    var action = (event) => {
      handler();
    };

    var btn = document.getElementById("remove-user-btn");
    btn.addEventListener("click", action);
  }

  /**
   * Binds the event of confirming the Remove User  modal
   * @param {function} handler a handler to invoke when the remove user modal is confirmed
   */
  bindConfirmRemoveUser(handler) {
    var action = (event) => {
      event.preventDefault();
      handler(this.userSelect.value);
    };

    var btn = document.getElementById("remove-user-form-confirm-btn");
    btn.addEventListener("click", action);
  }

  /**
   * Binds the event of canceling the Remove User modal
   * @param {function} handler a handler to invoke when the Remove User modal is canceled
   */
  bindCancelRemoveUser(handler) {
    var cancelAction = (event) => {
      event.preventDefault();
      handler();
    };

    var cancelBtn = document.getElementById("remove-user-form-cancel-btn");
    cancelBtn.addEventListener("click", cancelAction);
    var xBtn = document.getElementById("remove-user-modal-close-button");
    xBtn.addEventListener("click", cancelAction);
  }

  /**
   * Binds the event of selecting a user
   * @param {function} handler a function to invoke with the new user
   */
  bindOnUserChange(handler) {
    var action = (event) => {
      handler(event.target.value);
    };

    var select = document.getElementById("user-selection");
    select.addEventListener("change", action);
  }

  /**
   * Open the Add User Modal
   */
  openAddUserModal() {
    app.controls.openModal("add-user-form-modal");
  }

  /**
   * Closes the Add User Modal
   */
  closeAddUserModal() {
    app.controls.closeModal("add-user-form-modal");
  }

  /**
   * Open the Remove User Modal
   */
  openRemoveUserModal(userName) {
    document.getElementById(
      "remove-user-header-placeholder"
    ).textContent = userName;
    app.controls.openModal("remove-user-form-modal");
  }

  /**
   * Closes the Remove User Modal
   */
  closeRemoveUserModal() {
    app.controls.closeModal("remove-user-form-modal");
  }

  /**
   * Updates the state of the buttons depending on if there is a selected user or not
   * @param {String} selected the name of the selected user
   */
  updateButtons(selected) {
    var removeUserBtn = document.getElementById("remove-user-btn");
    if (!selected) {
      removeUserBtn.classList.add("w3-disabled");
      removeUserBtn.disabled = true;
    } else {
      removeUserBtn.classList.remove("w3-disabled");
      removeUserBtn.disabled = false;
    }
  }

  /**
   * Displays the available users
   * @param {String[]} users the set of users
   * @param {String} selected the name of the selected user
   */
  showUsers(users, selected) {
    var selector = document.getElementById("user-selection");
    removeChildren(selector);

    this.updateButtons(selected);
    if (!selected) {
      selector.appendChild(createPlaceholder());
    }

    users.forEach((user) => {
      var option = document.createElement("option");
      option.value = user;
      option.text = user;
      if (selected == user) {
        option.selected = true;
      }
      selector.appendChild(option);
    });
  }
}
