import Settings from "./settings";

export default class SettingsController {
  constructor(settingsModel, settingsView) {
    this.settingsModel = settingsModel;
    this.settingsView = settingsView;

    this.settingsView.bindOpenSettings(this.handleEditSettings.bind(this));
    this.settingsView.bindConfirmSettings(
      this.handleConfirmUpdateSettings.bind(this)
    );
    this.settingsView.bindCancelSettings(
      this.handleCancelUpdateSettings.bind(this)
    );

    this.user = null;
  }

  load(user) {
    this.user = user;
    this.settingsView.updateButtons(user);
  }

  onUserChangeHandler(user) {
    this.user = user;
    if (user != null) {
      this.user = user;
    }
  }

  handleEditSettings() {
    this.settingsView.openSettingsModal(
      this.user,
      this.settingsModel.get(this.user)
    );
  }

  handleConfirmUpdateSettings(formData) {
    var settings = new Settings(formData["refresh.interval"]);

    this.settingsModel.update(this.user, settings);
    this.settingsView.closeSettingsModal();
  }

  handleCancelUpdateSettings() {
    this.settingsView.closeSettingsModal();
  }
}
