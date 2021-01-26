import "./assets/w3/css/w3.css";
import "font-awesome/css/font-awesome.css";

import UserController from "./userController";
import UserView from "./userView";

import Settings from "./settings/settings";
import SettingsController from "./settings/settingsController";
import SettingsView from "./settings/settingsView";

import Controls from "./controls/controls";

import JobModel from "./jobs/jobModel";
import JobEntryController from "./jobs/jobEntryController";
import JobEntryView from "./jobs/jobEntryView";

import JobController from "./jobs/jobController";
import JobView from "./jobs/jobView";

export const controls = new Controls();

const userController = new UserController();
const userView = new UserView(userController);

const jobModel = new JobModel();
const jobEntryView = new JobEntryView();
export const jobEntry = new JobEntryController(jobModel, jobEntryView);

const jobView = new JobView();
const jobController = new JobController(jobModel, jobView, jobEntry);

const settingsController = new SettingsController(userController);
const settingsView = new SettingsView(userController, settingsController);
var currentRefreshFn;

export function addUser() {
  var form = document.getElementById("user-form");
  var inputs = form.querySelectorAll("input");
  var obj = {};
  for (var i = 0; i < inputs.length; i++) {
    var item = inputs.item(i);
    if (item.name) {
      obj[item.name] = item.value;
    }
  }

  var userName = obj["username"];

  // TODO highlight red
  if (!userController.hasUser(userName)) {
    userController.storeUser(userName);
    // immediately switch
    userController.setUser(userName);
    userView.layout();

    settingsView.layout();
    synchronizeSettings();
  }

  // TODO return correct control
  controls.closeModal("add-user-form-modal");
}

export function onUserChange() {
  userView.onUserChange();

  settingsView.layout();
  synchronizeSettings();
}

export function confirmRemoveUser() {
  // runController.removeAllRuns(userController.getCurrentUser());
  userController.removeUser(userController.getCurrentUser());

  userView.layout();
  // runView.layout();
  settingsView.layout();
  synchronizeSettings();

  controls.closeModal("remove-user-form-modal");
}

export function prepareRemoveUser() {
  userView.prepareRemoveModal();
  controls.openModal("remove-user-form-modal");
}

export function prepareSettingsModal() {
  settingsView.prepareSettingsModal();
  controls.openModal("settings-modal");
}

export function applySettings() {
  var form = document.getElementById("settings-form");
  var inputs = form.querySelectorAll("input");
  var obj = {};
  for (var i = 0; i < inputs.length; i++) {
    var item = inputs.item(i);
    if (item.name) {
      obj[item.name] = item.value;
    }
  }

  var newSettings = new Settings(obj["refresh.interval"]);
  settingsController.saveSettings(newSettings);
  synchronizeSettings();
  controls.closeModal("settings-modal");
}

function synchronizeSettings() {
  var userSettings = settingsController.getUserSettings();
  if (currentRefreshFn) {
    window.clearInterval(currentRefreshFn);
  }
  if (userSettings.refreshRateSeconds > 0) {
    currentRefreshFn = window.setInterval(function () {
      jobController.refreshJobStatus();
    }, userSettings.refreshRateSeconds * 1000);
  }
}

export function startApp() {
  controls.setEscapeClosesModals();

  userView.layout();
  settingsView.layout();
  synchronizeSettings();

  // cheap way of initializing the state everywhere
  jobModel.load(userController.getCurrentUser());

  // listen to updates from now on
  // TODo this should probably be on a userModel
  // the new jobController would then register on this and trigger downstream calls
  userController.registerOnUserChangeListener(jobModel.load.bind(jobModel));
}
