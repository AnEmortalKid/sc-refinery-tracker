import Settings from "./settings";

// dictionary by user name
const settingsKey = "mining_tracker.user_settings";

function defaultSettings() {
  return new Settings(1);
}

function areEqual(oldSettings, newSettings) {
  if (oldSettings.refreshRateSeconds !== newSettings.refreshRateSeconds) {
    return false;
  }

  return true;
}

export default class SettingsModel {
  constructor() {
    this.onUserSettingsListeners = [];
  }

  _fireSettingsChange(newSettings) {
    this.onUserSettingsListeners.forEach((listener) => {
      listener(newSettings);
    });
  }

  get(user) {
    var allSettings = JSON.parse(localStorage.getItem(settingsKey)) || {};
    if (!allSettings[user]) {
      return defaultSettings();
    }
    return allSettings[user];
  }

  update(user, settings) {
    var allSettings = JSON.parse(localStorage.getItem(settingsKey)) || {};

    var oldSettings = allSettings[user];
    allSettings[user] = settings;

    if (!areEqual(oldSettings, settings)) {
      localStorage.setItem(settingsKey, JSON.stringify(allSettings));
      this._fireSettingsChange(settings);
    }
  }

  delete(user) {
    var allSettings = JSON.parse(localStorage.getItem(settingsKey)) || {};

    delete allSettings[user];
    localStorage.setItem(settingsKey, JSON.stringify(allSettings));
    this._fireSettingsChange(null);
  }

  registerOnSettingsChangeListener(listener) {
    this.onUserSettingsListeners.push(listener);
  }
}
