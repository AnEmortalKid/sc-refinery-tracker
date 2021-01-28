import "./assets/w3/css/w3.css";
import "font-awesome/css/font-awesome.css";

import UserModel from "./users/userModel";
import UserController from "./users/userController";
import UserView from "./users/userView";

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

const userModel = new UserModel();
const userView = new UserView();
const userController = new UserController(userModel, userView);

const jobModel = new JobModel();
const jobEntryView = new JobEntryView();
export const jobEntry = new JobEntryController(jobModel, jobEntryView);

const jobView = new JobView();
const jobController = new JobController(jobModel, jobView, jobEntry);

const settingsController = new SettingsController(userModel);
const settingsView = new SettingsView(userModel, settingsController);
var currentRefreshFn;

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

  settingsView.layout();
  synchronizeSettings();

  // cheap way of initializing the state everywhere
  jobModel.load(userModel.getCurrent());

  userModel.registerOnUserChangeListener(
    jobController.onUserChangeHandler.bind(jobController)
  );
  userModel.registerOnUserDeletedListener(
    jobController.onUserDeletedHandler.bind(jobController)
  );

  userModel.registerOnUserChangeListener(() => {
    settingsView.layout();
    synchronizeSettings();
  });
}
