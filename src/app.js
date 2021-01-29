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
import SettingsModel from "./settings/settingsModel";

export const controls = new Controls();

const userModel = new UserModel();
const userView = new UserView();
const userController = new UserController(userModel, userView);

const jobModel = new JobModel();
const jobEntryView = new JobEntryView();
export const jobEntry = new JobEntryController(jobModel, jobEntryView);

const jobView = new JobView();
const jobController = new JobController(jobModel, jobView, jobEntry);

const settingsModel = new SettingsModel();
const settingsView = new SettingsView();
const settingsController = new SettingsController(settingsModel, settingsView);

var currentRefreshFn;

function synchronizeSettings(userSettings) {
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

  var current = userModel.getCurrent();
  if (current) {
    synchronizeSettings(settingsModel.get(current));
  }

  jobModel.load(userModel.getCurrent());
  settingsController.load(userModel.getCurrent());
  userModel.registerOnUserChangeListener(
    jobController.onUserChangeHandler.bind(jobController)
  );
  userModel.registerOnUserDeletedListener(
    jobController.onUserDeletedHandler.bind(jobController)
  );
  userModel.registerOnUserChangeListener(
    settingsController.onUserChangeHandler.bind(settingsController)
  );
  settingsModel.registerOnSettingsChangeListener(synchronizeSettings);
}
