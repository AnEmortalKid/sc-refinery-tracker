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
}
