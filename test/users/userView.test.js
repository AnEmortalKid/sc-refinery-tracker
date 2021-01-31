/**
 * @jest-environment jsdom
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import UserView from "../../src/users/userView";

const usersViewPath = resolve(
  __dirname,
  "..",
  "..",
  "src",
  "views",
  "users",
  "usersView.html"
);
const usersAddModalPath = resolve(
  __dirname,
  "..",
  "..",
  "src",
  "views",
  "users",
  "addUserModal.html"
);
const removeUserModalPath = resolve(
  __dirname,
  "..",
  "..",
  "src",
  "views",
  "users",
  "removeUserModal.html"
);
const usersView = readFileSync(usersViewPath, { encoding: "utf8", flag: "r" });
const addUserModal = readFileSync(usersAddModalPath, {
  encoding: "utf8",
  flag: "r",
});
const removeUserModal = readFileSync(removeUserModalPath, {
  encoding: "utf8",
  flag: "r",
});

var controls;
beforeEach(() => {
  document.body.innerHTML = `<html><body>
    ${usersView}
    ${addUserModal}
    ${removeUserModal}
    </body></html>`;

  controls = {
    openModal: jest.fn(),
    closeModal: jest.fn(),
  };
});

describe("bindAddUser", () => {
  test("calls bound handler", () => {
    var mockHandler = jest.fn();
    var view = new UserView();
    view.bindAddUser(mockHandler);

    var element = document.getElementById("add-user-btn");
    element.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});

describe("bindConfirmAddUser", () => {
  test("calls bound handler with data on click", () => {
    var mockHandler = jest.fn();
    var view = new UserView();
    view.bindConfirmAddUser(mockHandler);

    var input = document.getElementById("user-form-username");
    input.value = "newUserName";

    var button = document.getElementById("add-user-form-confirm-btn");
    button.click();

    expect(mockHandler).toHaveBeenCalledWith("newUserName");
  });

  test("calls bound handler with submit on form", () => {
    var mockHandler = jest.fn();
    var view = new UserView();
    view.bindConfirmAddUser(mockHandler);

    var input = document.getElementById("user-form-username");
    input.value = "newUserName";

    var form = document.getElementById("user-form");
    form.submit();

    expect(mockHandler).toHaveBeenCalledWith("newUserName");
  });
});

describe("bindCancelAddUserForm", () => {
  test("calls bound handler with data on click", () => {
    var mockHandler = jest.fn();
    var view = new UserView();
    view.bindCancelAddUserForm(mockHandler);

    var button = document.getElementById("add-user-form-cancel-btn");
    button.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});

describe("bindRemoveUser", () => {
  test("calls bound handler on click", () => {
    var mockHandler = jest.fn();
    var view = new UserView();
    view.bindRemoveUser(mockHandler);

    var button = document.getElementById("remove-user-btn");
    button.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});

describe("bindConfirmRemoveUser", () => {
  test("calls bound handler with data on click", () => {
    var mockHandler = jest.fn();
    var view = new UserView();
    view.bindConfirmRemoveUser(mockHandler);

    var selectOption = document.createElement("option");
    selectOption.value = "selectedUser";
    selectOption.textContent = "selectedUser";
    selectOption.selected = true;
    var select = document.getElementById("user-selection");
    select.appendChild(selectOption);
    select.value = "selectedUser";

    var button = document.getElementById("remove-user-form-confirm-btn");
    button.click();

    expect(mockHandler).toHaveBeenCalledWith("selectedUser");
  });
});
describe("bindCancelRemoveUser", () => {
  test("calls bound handler on click", () => {
    var mockHandler = jest.fn();
    var view = new UserView();
    view.bindCancelRemoveUser(mockHandler);

    var button = document.getElementById("remove-user-form-cancel-btn");
    button.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});
describe("bindOnUserChange", () => {
  test("calls bound handler with data on change", () => {
    var mockHandler = jest.fn();
    var view = new UserView();
    view.bindOnUserChange(mockHandler);

    var selectOption = document.createElement("option");
    selectOption.value = "changedValue";
    selectOption.textContent = "changedValue";
    selectOption.selected = true;
    var select = document.getElementById("user-selection");
    select.appendChild(selectOption);
    select.value = "changedValue";

    var event = new Event("change");
    select.dispatchEvent(event);

    expect(mockHandler).toHaveBeenCalledWith("changedValue");
  });
});
describe("showUsers", () => {
  test("lays out data and sets selected user", () => {
    var view = new UserView();

    var users = ["foo", "bar", "baz"];
    view.showUsers(users, "bar");

    var select = document.getElementById("user-selection");
    expect(select.children.length).toBe(3);
    for (var i = 0; i < 3; i++) {
      var option = select.children[i];
      expect(option.value).toBe(users[i]);
      expect(option.text).toBe(users[i]);
    }
    expect(select.value).toBe("bar");
  });
  test("adds placeholder on not selected", () => {
    var view = new UserView();

    var users = ["foo", "bar", "baz"];
    view.showUsers(users);

    var select = document.getElementById("user-selection");
    var placeholder = select.children[0];
    expect(placeholder.value).toBe("");
    expect(placeholder.text).toBe("Select or Create a User.");
    expect(placeholder.disabled).toBeTruthy();
    expect(placeholder.selected).toBeTruthy();
  });
});

describe("modal controls", () => {
  test("addOpenUserModal", () => {
    var view = new UserView(controls);
    view.openAddUserModal();
    expect(controls.openModal).toHaveBeenCalledWith("add-user-form-modal");
  });
  test("addOpenUserModal", () => {
    var view = new UserView(controls);
    view.closeAddUserModal();
    expect(controls.closeModal).toHaveBeenCalledWith("add-user-form-modal");
  });

  test("openRemoveUserModal", () => {
    var view = new UserView(controls);
    view.openRemoveUserModal("toDelete");
    var placeholder = document.getElementById("remove-user-header-placeholder");
    expect(placeholder.textContent).toBe("toDelete");
    expect(controls.openModal).toHaveBeenCalledWith("remove-user-form-modal");
  });
  test("closeRemoveUserModal", () => {
    var view = new UserView(controls);
    view.closeRemoveUserModal();
    expect(controls.closeModal).toHaveBeenCalledWith("remove-user-form-modal");
  });
});
