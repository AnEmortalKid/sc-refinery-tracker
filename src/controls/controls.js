function _createSuccessIcon() {
  //   <span class="w3-tag w3-green w3-display-left">
  //     <i class="fa fa-check-circle fa-2x" style="color:white"></i>
  //   </span>
  var successIconContainer = document.createElement("span");
  successIconContainer.classList.add("w3-tag", "w3-green", "w3-display-left");
  var successIcon = document.createElement("i");
  successIcon.classList.add("fa", "fa-check-circle", "fa-2x");
  successIcon.style = "color:white";
  successIconContainer.appendChild(successIcon);
  return successIconContainer;
}

function _createMessage(alertMsg) {
  //   <h4 class="w3-margin-left w3-padding">User added</h4>
  var message = document.createElement("h4");
  message.classList.add("w3-margin-left", "w3-padding");
  message.textContent = alertMsg;
  return message;
}

function _createCloseIcon(id) {
  //   <span class="w3-tag w3-green w3-round-xlarge w3-display-right">
  //     <i class="fa fa-times fa-2x" style="color:white"></i>
  //   </span>
  var closeIconContainer = document.createElement("span");
  closeIconContainer.classList.add("w3-tag", "w3-green", "w3-display-right");
  var closeIcon = document.createElement("i");
  closeIcon.classList.add("fa", "fa-times", "fa-2x");
  closeIcon.style = "color:white";
  closeIcon.onclick = () => {
    document.getElementById(id).remove();
  };
  closeIconContainer.appendChild(closeIcon);
  return closeIconContainer;
}

export default class Controls {
  openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";

    // if it has a form, focus the first element
    var inputs = modal.querySelectorAll("input");
    if (inputs.length > 0) {
      inputs[0].focus();
    }
  }

  closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
  }

  setEscapeClosesModals() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        var modals = document.getElementsByClassName("w3-modal");
        for (var i = 0; i < modals.length; i++) {
          var modal = modals[i];
          if (modal.style.display === "block") {
            this.closeModal(modal.id);
          }
        }
      }
    });
  }

  displayAlert(alertMsg) {
    var id = "alert-" + new Date().getMilliseconds();
    var panel = document.createElement("div");
    panel.classList.add(
      "w3-display-container",
      "w3-panel",
      "w3-green",
      "w3-card-4",
      "w3-round-large",
      "rf-alert-fade-out"
    );
    panel.id = id;
    panel.appendChild(_createSuccessIcon());
    panel.appendChild(_createMessage(alertMsg));
    panel.appendChild(_createCloseIcon(id));

    var alertcontainer = document.getElementById('alert-container');
    alertcontainer.prepend(panel);

    setTimeout(function () {
      document.getElementById(id).remove();
    }, 5000);
  }
}
