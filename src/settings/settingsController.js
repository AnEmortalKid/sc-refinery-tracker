import Settings from "./settings";

// dictionary by user name
const settingsKey = "mining_tracker.user_settings";

function defaultSettings() {
  return new Settings(1);
}

function storeSettings(userName, settings) {
  var rawSettingsData = localStorage.getItem(settingsKey);
  var allSettings = {};
  if (rawSettingsData) {
    allSettings = JSON.parse(rawSettingsData);
  }

  allSettings[userName] = settings;
  localStorage.setItem(settingsKey, JSON.stringify(allSettings));
}

function removeUserSettings(userName) {
  var rawSettingsData = localStorage.getItem(settingsKey);
  var allSettings = {};
  if (rawSettingsData) {
    allSettings = JSON.parse(rawSettingsData);
  }

  delete allSettings[userName];
  localStorage.setItem(settingsKey, JSON.stringify(allSettings));
}

export default class SettingsController {
  constructor(userModel) {
    this.userModel = userModel;
  }

  getUserSettings() {
    var raw = localStorage.getItem(settingsKey);
    if (!raw) {
      return defaultSettings();
    }

    var current = this.userModel.getCurrent();
    var allSettings = JSON.parse(raw);
    if (!allSettings[current]) {
      return defaultSettings();
    } else {
      return allSettings[current];
    }
  }

  saveSettings(settings) {
    // this modal should be disabled if no user selected eventually
    if (this.userModel.getCurrent()) {
      storeSettings(this.userModel.getCurrent(), settings);
    }
  }

  removeSettings(userName) {
    if (userName) {
      removeUserSettings(userName);
    }
  }
}
