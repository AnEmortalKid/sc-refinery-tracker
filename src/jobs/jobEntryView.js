import { getMaterialsList } from "../model/materials";

function createMaterialSelect(id) {
  var selectDiv = document.createElement("div");
  selectDiv.classList.add("w3-third");

  var select = document.createElement("select");
  select.classList.add("w3-select", "w3-border", "w3-light-grey");
  select.id = "materials-select-" + id;

  var materialList = getMaterialsList();
  for (var i = 0; i < materialList.length; i++) {
    var option = document.createElement("option");
    option.value = materialList[i];
    option.text = materialList[i];
    select.appendChild(option);
  }
  selectDiv.appendChild(select);

  selectDiv.dataset.selectId = select.id;
  return selectDiv;
}

function createRemoveMaterialInput(id) {
  var removeMaterialDiv = document.createElement("div");
  removeMaterialDiv.classList.add("w3-half");

  var removeButton = document.createElement("button");
  removeButton.classList.add("w3-btn", "w3-blue-grey", "w3-round-large");
  removeButton.type = "button";
  removeButton.onclick = () => document.getElementById(id).remove();

  var icon = document.createElement("i");
  icon.classList.add("fa", "fa-minus");
  removeButton.appendChild(icon);
  removeMaterialDiv.appendChild(removeButton);

  return removeMaterialDiv;
}

function createMaterialInputValue(id, selectId, removable = true) {
  var materialEntryDiv = document.createElement("div");
  materialEntryDiv.classList.add("w3-third", "w3-row-padding");

  var materialInputDiv = document.createElement("div");
  materialInputDiv.classList.add("w3-half");
  var materialInput = document.createElement("input");
  materialInput.classList.add("w3-input", "w3-border", "w3-light-grey");
  materialInput.type = "number";
  materialInput.placeholder = 0;
  materialInput.min = 0;
  materialInput.name = "material.input." + id;
  materialInput.dataset.selectId = selectId;
  materialInputDiv.appendChild(materialInput);

  materialEntryDiv.appendChild(materialInputDiv);

  if (removable) {
    var removeMaterialDiv = createRemoveMaterialInput(id);
    materialEntryDiv.appendChild(removeMaterialDiv);
  }

  return materialEntryDiv;
}
/**
 * Component responsible for managing the view portion of adding or editing refinery jobs
 */
export default class JobEntryView {
  constructor() {
    this.form = document.getElementById("add-job-form");
  }

  toggleMaterialEntryMode(toggleState) {
    var yieldRow = document.getElementById("yield-units");
    var materialRow = document.getElementById("material-units");

    yieldRow.hidden = toggleState;
    materialRow.hidden = !toggleState;

    if (toggleState) {
      var container = document.getElementById("materials-container");

      // if there's no material entries, create the first one
      if (container.children.length < 1) {
        // create option without ability to remove
        this.addMaterialOption(false);
      }
    }
  }

  addMaterialOption(removable = true) {
    var container = document.getElementById("materials-container");

    var rowId = new Date().getTime();
    var row = document.createElement("div");
    row.classList.add("w3-row", "w3-section");
    row.id = rowId;

    var selectDiv = createMaterialSelect(rowId);
    row.appendChild(selectDiv);
    row.appendChild(
      createMaterialInputValue(rowId, selectDiv.dataset.selectId, removable)
    );
    container.appendChild(row);
  }

  bindToggleMaterialsMode(handler) {
    document
      .getElementById("add-job-form-entryMode")
      .addEventListener("click", (event) => {
        handler(event);
      });
  }

  bindAddMaterial(handler) {
    document
      .getElementById("add-job-form-add-material")
      .addEventListener("click", (event) => {
        event.preventDefault();
        handler();
      });
  }

  /**
   * Binds the submission of the Job to the given handler
   * @param {function} handler a callback to call with the data for the form
   */
  bindSubmitJob(handler) {
    var submissionAction = (event) => {
      event.preventDefault();
      handler(this._getFormData());
    };

    this.form.addEventListener("submit", submissionAction);
    var btn = document.getElementById("add-job-form-confirm-btn");
    btn.addEventListener("click", submissionAction);
  }

  bindCancelEntryForm(handler) {
    var cancelAction = (event) => {
      event.preventDefault();
      handler();
    };

    /*
     * a bit silly to have the view call the controller to call the view,
     * but it is up to the controller to tell us when to close
     */
    var cancelBtn = document.getElementById("add-job-form-cancel-btn");
    cancelBtn.addEventListener("click", cancelAction);
    var xBtn = document.getElementById("add-job-modal-close-button");
    xBtn.addEventListener("click", cancelAction);
  }

  bindOnFormDataChange(handler) {
    var changeAction = (event) => {
      handler(this._getFormData());
    };

    var selectLocation = document.getElementById("add-job-select-location");
    selectLocation.addEventListener("change", changeAction);
  }

  closeEntryModal() {
    app.controls.closeModal("add-job-modal");
  }

  _getFormData() {
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

    // pass materials if available
    var entryCheckBox = document.getElementById("add-job-form-entryMode");
    if (entryCheckBox.checked) {
      var materialsEntered = {};
      var materialContainer = document.getElementById("material-units");
      var materialInputs = materialContainer.querySelectorAll("input");
      for (var i = 0; i < materialInputs.length; i++) {
        var materialInput = materialInputs[i];
        var select = document.getElementById(materialInput.dataset.selectId);
        materialsEntered[select.value] = parseInt(materialInput.value);
      }
      obj.materials = materialsEntered;
    }

    return obj;
  }

  toggleSubmitButton(enabled) {
    var submitButton = document.getElementById("add-job-form-confirm-btn");
    if (enabled) {
      submitButton.disabled = false;
      submitButton.classList.remove("w3-disabled");
    } else {
      submitButton.disabled = true;
      submitButton.classList.add("w3-disabled");
    }
  }

  markLocationInvalid() {
    // TODO enable/disable confirm based on validation

    // TODO a change listener on the selection form should
    // callback to controller.onSelectLocationChange

    // TODO a change listner on each material select form should
    // callback to controller and pass ALL materials data (even dupes)?
    var selecter = document.getElementById("add-job-select-location");
    if (!selecter.classList.contains("w3-border-red")) {
      selecter.classList.add("w3-border-red");
    }
  }
}
