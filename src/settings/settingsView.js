const buttonId = "user-settings-modal-btn";

export default class SettingsView {
  constructor(userModel, settingsController) {
    this.userModel = userModel;
    this.settingsController = settingsController;
  }

  layout() {
    var button = document.getElementById(buttonId);
    if (!this.userModel.getCurrent()) {
      // nothing selected, disable our button
      if (!button.classList.contains("w3-disabled")) {
        button.classList.add("w3-disabled");
      }
    } else {
      button.classList.remove("w3-disabled");
    }
  }

  prepareSettingsModal() {
    if (!this.userModel.getCurrent()) {
      return;
    }

    document.getElementById(
      "user-settings-header-placeholder"
    ).textContent = this.userModel.getCurrent();

    var currentSettings = this.settingsController.getUserSettings();
    var form = document.getElementById("settings-form");
    var inputs = form.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
      var item = inputs.item(i);
      if (item.name == "refresh.interval") {
        item.value = currentSettings.refreshRateSeconds;
      }
    }
  }
}
