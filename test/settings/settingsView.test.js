/**
 * @jest-environment jsdom
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import SettingsView from "../../src/settings/settingsView";

const headerPath = resolve(
  __dirname,
  "..",
  "..",
  "src",
  "views",
  "header.html"
);
const headerView = readFileSync(headerPath, { encoding: "utf8", flag: "r" });
const settingsModalPath = resolve(
  __dirname,
  "..",
  "..",
  "src",
  "views",
  "settings",
  "settingsModal.html"
);
const settingsView = readFileSync(settingsModalPath, {
  encoding: "utf8",
  flag: "r",
});

var controls;
beforeEach(() => {
  document.body.innerHTML = `<html><body>
    ${headerView}
    ${settingsView}
    </body></html>`;

  controls = {
    openModal: jest.fn(),
    closeModal: jest.fn(),
  };
});

describe("bindOpenSettings", () => {
  test("calls bound handler", () => {
    var mockHandler = jest.fn();
    var view = new SettingsView();
    view.bindOpenSettings(mockHandler);

    var element = document.getElementById("user-settings-modal-btn");
    element.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});
describe("bindConfirmSettings", () => {
  // test("calls bound handler with data on click", () => {
  //     var mockHandler = jest.fn();
  //     var view = new UserView();
  //     view.bindConfirmAddUser(mockHandler);
  //     var input = document.getElementById("user-form-username");
  //     input.value = "newUserName";
  //     var button = document.getElementById("add-user-form-confirm-btn");
  //     button.click();
  //     expect(mockHandler).toHaveBeenCalledWith("newUserName");
  //   });
  //   test("calls bound handler with submit on form", () => {
  //     var mockHandler = jest.fn();
  //     var view = new UserView();
  //     view.bindConfirmAddUser(mockHandler);
  //     var input = document.getElementById("user-form-username");
  //     input.value = "newUserName";
  //     var form = document.getElementById("user-form");
  //     form.submit();
  //     expect(mockHandler).toHaveBeenCalledWith("newUserName");
  //   });
});

describe("bindCancelSettings", () => {});

describe("modal controls", () => {
  test("openSettingsModal", () => {
    var view = new SettingsView(controls);

    var userSettings = { refreshRateSeconds: 25 };
    view.openSettingsModal("testUser", userSettings);
    expect(controls.openModal).toHaveBeenCalledWith("settings-modal");

    // sets up state
    var headerPlaceholder = document.getElementById(
      "user-settings-header-placeholder"
    );
    expect(headerPlaceholder.textContent).toBe("testUser");

    // only one input exists atm
    var form = document.getElementById("settings-form");
    var inputs = form.querySelectorAll("input");
    expect(inputs[0].value).toBe("25");
    expect(inputs[0].name).toBe("refresh.interval");
  });
  test("closeSettingsModal", () => {
    var view = new SettingsView(controls);
    view.closeSettingsModal();
    expect(controls.closeModal).toHaveBeenCalledWith("settings-modal");
  });
});
