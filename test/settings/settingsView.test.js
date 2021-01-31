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
    displayAlert: jest.fn()
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
  test("calls bound handler with data on click", () => {
    var mockHandler = jest.fn();
    var view = new SettingsView();
    view.bindConfirmSettings(mockHandler);

    var form = document.getElementById("settings-form");
    var inputs = form.querySelectorAll("input");
    inputs[0].value = "55";

    var button = document.getElementById("settings-confirm-btn");
    button.click();
    expect(mockHandler).toHaveBeenCalledWith({ "refresh.interval": "55" });
  });
  test("calls bound handler with data on submit", () => {
    var mockHandler = jest.fn();
    var view = new SettingsView();
    view.bindConfirmSettings(mockHandler);

    var form = document.getElementById("settings-form");
    var inputs = form.querySelectorAll("input");
    inputs[0].value = "55";

    form.submit();
    expect(mockHandler).toHaveBeenCalledWith({ "refresh.interval": "55" });
  });
});

describe("bindCancelSettings", () => {
  test("calls bound handler on click", () => {
    var mockHandler = jest.fn();
    var view = new SettingsView();
    view.bindCancelSettings(mockHandler);
    var button = document.getElementById("settings-cancel-btn");
    button.click();
    expect(mockHandler).toHaveBeenCalled();
  });
});

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

describe("updateButtons", () => {
  test("selected user enables button", () => {
    var view = new SettingsView(controls);
    view.updateButtons("someUser");

    var btn = document.getElementById("user-settings-modal-btn");
    expect(btn.disabled).toBeFalsy();
    expect(btn.classList).not.toContain("w3-disabled");
  });
  test("no user disables button", () => {
    var view = new SettingsView(controls);
    view.updateButtons(null);

    var btn = document.getElementById("user-settings-modal-btn");
    expect(btn.disabled).toBeTruthy();
    expect(btn.classList).toContain("w3-disabled");
  });
});

describe("alerts", () => {
  test("alertSettingsUpdated", () => {
    var view = new SettingsView(controls);
    view.alertSettingsUpdated();
    expect(controls.displayAlert).toHaveBeenCalledWith("Settings Updated.");
  });
});
