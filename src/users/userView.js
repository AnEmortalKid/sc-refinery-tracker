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
    this.userSelect = document.getElementById("user-selection");
  }

  bindAddUser(handler) {
    var action = (event) => {
      handler();
    };

    var btn = document.getElementById("add-user-btn");
    btn.addEventListener("click", action);
  }

  bindConfirmAddUser(handler) {
    var submissionAction = (event) => {
      event.preventDefault();
      handler(this._getFormData());
    };

    this.addUserForm.addEventListener("submit", submissionAction);
    var btn = document.getElementById("add-user-form-confirm-btn");
    btn.addEventListener("click", submissionAction);
  }

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

  bindRemoveUser(handler) {
    var action = (event) => {
      handler();
    };

    var btn = document.getElementById("remove-user-btn");
    btn.addEventListener("click", action);
  }

  bindConfirmRemoveUser(handler) {
    var action = (event) => {
      event.preventDefault();
      handler(this.userSelect.value);
    };

    var btn = document.getElementById("remove-user-form-modal");
    btn.addEventListener("click", action);
  }

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

  bindOnUserChange(handler) {
    var action = (event) => {
      handler(event.target.value);
    };

    var select = document.getElementById("user-selection");
    select.addEventListener("change", action);
  }

  _getFormData() {
    var form = document.getElementById("user-form");
    var inputs = form.querySelectorAll("input");

    var obj = {};
    for (var i = 0; i < inputs.length; i++) {
      var item = inputs.item(i);
      if (item.name) {
        obj[item.name] = item.value;
      }
    }

    return obj;
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
