const selectorId = "user-selection";

import { removeChildren } from "./elementUtils";

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
  constructor(userController) {
    this.userController = userController;
  }

  layout() {
    var selector = document.getElementById(selectorId);
    removeChildren(selector);

    if (!this.userController.getCurrentUser()) {
      selector.appendChild(createPlaceholder());
      document.getElementById("remove-user-btn").classList.add("w3-disabled");
    } else {
      document
        .getElementById("remove-user-btn")
        .classList.remove("w3-disabled");
    }

    var users = this.userController.getUsers();
    users.forEach((user) => {
      var option = document.createElement("option");
      option.value = user;
      option.text = user;
      if (this.userController.getCurrentUser() == user) {
        option.selected = true;
      }
      selector.appendChild(option);
    });
  }

  onUserChange() {
    var selector = document.getElementById(selectorId);
    var value = selector.value;
    this.userController.setUser(value);
    this.layout();
  }

  prepareRemoveModal() {
    document.getElementById(
      "remove-user-header-placeholder"
    ).textContent = this.userController.getCurrentUser();
  }
}
