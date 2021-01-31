export default class SettingsView {
  constructor(controls) {
    this.controls = controls;

    this.form = document.getElementById("settings-form");
    this.headerPlaceholder = document.getElementById(
      "user-settings-header-placeholder"
    );
  }

  bindOpenSettings(handler) {
    var action = (event) => {
      handler();
    };

    var btn = document.getElementById("user-settings-modal-btn");
    btn.addEventListener("click", action);
  }

  bindConfirmSettings(handler) {
    var submissionAction = (event) => {
      event.preventDefault();
      handler(this._getFormData());
    };

    this.form.addEventListener("submit", submissionAction);
    var btn = document.getElementById("settings-confirm-btn");
    btn.addEventListener("click", submissionAction);
  }

  bindCancelSettings(handler) {
    var action = (event) => {
      event.preventDefault();
      handler();
    };

    var closeBtn = document.getElementById("settings-close-button");
    closeBtn.addEventListener("click", action);
    var cancelBtn = document.getElementById("settings-cancel-btn");
    cancelBtn.addEventListener("click", action);
  }

  _getFormData() {
    var inputs = this.form.querySelectorAll("input");

    var obj = {};
    for (var i = 0; i < inputs.length; i++) {
      var item = inputs.item(i);
      if (item.name) {
        obj[item.name] = item.value;
      }
    }

    return obj;
  }

  openSettingsModal(user, settings) {
    this.headerPlaceholder.textContent = user;

    var inputs = this.form.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
      var item = inputs.item(i);
      if (item.name == "refresh.interval") {
        item.value = settings.refreshRateSeconds;
      }
    }

    this.controls.openModal("settings-modal");
  }

  closeSettingsModal() {
    this.controls.closeModal("settings-modal");
  }

  /**
   * Updates the state of the buttons depending on if there is a selected user or not
   * @param {String} selected the name of the selected user
   */
  updateButtons(selected) {
    var settingsBtn = document.getElementById("user-settings-modal-btn");
    if (!selected) {
      settingsBtn.classList.add("w3-disabled");
      settingsBtn.disabled = true;
    } else {
      settingsBtn.classList.remove("w3-disabled");
      settingsBtn.disabled = false;
    }
  }
}
