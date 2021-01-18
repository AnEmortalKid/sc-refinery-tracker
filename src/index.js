import "./assets/w3/css/w3.css";
import "font-awesome/css/font-awesome.css";

import RunView from "./runView";
import RunEntry from "./runEntry";
import RunController from "./runController";

import UserController from "./userController";
import UserView from "./userView";

import Settings from "./settings/settings";
import SettingsController from "./settings/settingsController";
import SettingsView from "./settings/settingsView";

const userController = new UserController();
const userView = new UserView(userController);

const runController = new RunController(userController);
const runView = new RunView(userController, runController);

const settingsController = new SettingsController(userController);
const settingsView = new SettingsView(userController, settingsController);
var currentRefreshFn;

export function submitJobEntry() {
  var form = document.getElementById("add-job-form");
  var inputs = form.querySelectorAll("input");

  var obj = {};
  for (var i = 0; i < inputs.length; i++) {
    var item = inputs.item(i);
    if (item.name) {
      obj[item.name] = item.value;
    }
  }

  var selects = form.querySelectorAll("select");
  for (var i = 0; i < selects.length; i++) {
    var item = selects.item(i);
    if (item.name) {
      obj[item.name] = item.value;
    }
  }

  var durationStr = "";
  if (obj["duration.days"] > 0) {
    durationStr += obj["duration.days"] + "d ";
  }
  if (obj["duration.hours"] > 0) {
    durationStr += obj["duration.hours"] + "h ";
  }
  if (obj["duration.minutes"] > 0) {
    durationStr += obj["duration.minutes"] + "m ";
  }
  if (obj["duration.seconds"] > 0) {
    durationStr += obj["duration.seconds"] + "s";
  }
  durationStr = durationStr.trim();
  // if nothing was entered
  if (durationStr == "") {
    durationStr = "0s";
  }

  var runEntry = new RunEntry(
    obj["name"],
    obj["location"],
    durationStr,
    obj["yieldAmount"]
  );

  if (runView.isValidEntry(runEntry)) {
    runController.store(runEntry);
    closeModal("add-job-modal");
    runView.layout();
  } else {
    // TODO SHAKE IT
  }
}

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

  // TODO perhaps return something?
  if (!userController.hasUser(userName)) {
    userController.storeUser(userName);
    // immediately switch
    userController.setUser(userName);
    userView.layout();
    
    runController.loadRuns();
    runView.layout();

    settingsView.layout();
    synchronizeSettings();
  }

  closeModal("add-user-form-modal");
}

export function onUserChange() {
  userView.onUserChange();

  settingsView.layout();
  synchronizeSettings();

  runController.loadRuns();
  runView.layout();
}

export function confirmRemoveUser() {
  runController.removeAllRuns(userController.getCurrentUser());
  userController.removeUser(userController.getCurrentUser());

  userView.layout();
  runView.layout();
  settingsView.layout();
  synchronizeSettings();

  closeModal("remove-user-form-modal");
}

export function confirmRemoveAllJobs() {
  runController.removeAllRuns(userController.getCurrentUser());
  runView.layout();
  closeModal("remove-all-jobs-modal");
}

export function prepareRemoveUser() {
  userView.prepareRemoveModal();
  openModal("remove-user-form-modal");
}

export function removeRun(runId) {
  runController.remove(runId);
  runView.layout();
}

export function prepareSettingsModal() {
  settingsView.prepareSettingsModal();
  openModal("settings-modal");
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
  closeModal("settings-modal");
}

function synchronizeSettings() {
  var userSettings = settingsController.getUserSettings();
  if (currentRefreshFn) {
    window.clearInterval(currentRefreshFn);
  }
  if (userSettings.refreshRateSeconds > 0) {
    currentRefreshFn = window.setInterval(function () {
      runView.layout();
    }, userSettings.refreshRateSeconds * 1000);
  }
}

export function startApp() {
  userView.layout();
  runController.loadRuns();
  runView.layout();
  settingsView.layout();
  synchronizeSettings();
}
