export default class Controls {
  openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
  }

  closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
  }
}
