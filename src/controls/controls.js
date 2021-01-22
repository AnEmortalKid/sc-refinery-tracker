export default class Controls {
  openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
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
