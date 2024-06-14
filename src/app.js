import "./assets/w3/css/w3.css";
import "./assets/refinery-tracker/css/rf.css";
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
import SortController from "./jobs/sorting/sortController";

import JobController from "./jobs/jobController";
import JobView from "./jobs/jobView";
import SettingsModel from "./settings/settingsModel";

export const controls = new Controls();

const userModel = new UserModel();
const userView = new UserView(controls);
const userController = new UserController(userModel, userView);

const jobModel = new JobModel();
const jobEntryView = new JobEntryView(controls);
export const jobEntry = new JobEntryController(jobModel, jobEntryView);

const sortController = new SortController();
const jobView = new JobView(controls);
const jobController = new JobController(
  jobModel,
  jobView,
  jobEntry,
  sortController
);

const settingsModel = new SettingsModel();
const settingsView = new SettingsView(controls);
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

console.log('[sc-refinery-tracker] app loaded');
export function startApp() {
  console.log('[sc-refinery-tracker] starting app');
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
