const selectorId = "user-selection";

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
  constructor() {}

  bindAddUser(handler) {
    var action = (event) => {
      handler();
    };

    var btn = document.getElementById("add-user-btn");
    btn.addEventListener("click", action);
  }

  bindConfirmAddUser(handler) {
    var submissionAction = (event) => {
      handler(this._getFormData());
    };

    // this.form.addEventListener("submit", submissionAction);
    var btn = document.getElementById("add-user-form-confirm-btn");
    btn.addEventListener("click", submissionAction);
  }

  bindRemoveUser(handler) {
    var action = (event) => {
      handler();
    };

    var btn = document.getElementById("remove-user-btn");
    btn.addEventListener("click", action);
  }

  bindOnUserChange(handler) {
    var action = (event) => {
      handler(event.target.value);
    };

    var select = document.getElementById("user-selection");
    select.addEventListener("change", action);
  }

  _getFormData() {
    var input = document.getElementById("user-form-username");
    return input.value;
  }

  showUser(user) {
    // TODO
  }

  // layout() {
  //   var selector = document.getElementById(selectorId);
  //   removeChildren(selector);

  //   if (!this.userController.getCurrentUser()) {
  //     selector.appendChild(createPlaceholder());
  //     document.getElementById("remove-user-btn").classList.add("w3-disabled");
  //   } else {
  //     document
  //       .getElementById("remove-user-btn")
  //       .classList.remove("w3-disabled");
  //   }

  //   var users = this.userController.getUsers();
  //   users.forEach((user) => {
  //     var option = document.createElement("option");
  //     option.value = user;
  //     option.text = user;
  //     if (this.userController.getCurrentUser() == user) {
  //       option.selected = true;
  //     }
  //     selector.appendChild(option);
  //   });
  // }

  // onUserChange() {
  //   var selector = document.getElementById(selectorId);
  //   var value = selector.value;
  //   this.userController.setUser(value);
  //   this.layout();
  // }

  // prepareRemoveModal() {
  //   document.getElementById(
  //     "remove-user-header-placeholder"
  //   ).textContent = this.userController.getCurrentUser();
  // }
}
