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

function createMaterialInputValue(id, selectId) {
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

  var removeMaterialDiv = document.createElement("div");
  removeMaterialDiv.classList.add("w3-half");
  removeMaterialDiv.id = "remove.material.parent." + id;

  var removeButton = document.createElement("button");
  removeButton.classList.add("w3-btn", "w3-blue-grey", "w3-round-large");
  removeButton.onclick = () => document.getElementById(id).remove();

  var icon = document.createElement("i");
  icon.classList.add("fa", "fa-minus");
  removeButton.appendChild(icon);
  removeMaterialDiv.appendChild(removeButton);

  materialEntryDiv.appendChild(materialInputDiv);
  materialEntryDiv.appendChild(removeMaterialDiv);

  return materialEntryDiv;
}
/**
 * Component responsible for managing the view portion of adding or editing refinery jobs
 */
export default class JobEntryView {
  toggleMaterialEntryMode(toggleState) {
    var yieldRow = document.getElementById("yield-units");
    var materialRow = document.getElementById("material-units");

    yieldRow.hidden = toggleState;
    materialRow.hidden = !toggleState;

    if (toggleState) {
      var container = document.getElementById("materials-container");
      // if there's no material entries, create the first one and clean it up
      if (container.children.length < 1) {
        var firstEntryId = this.addMaterialOption();
        // remove the delete button
        document
          .getElementById("remove.material.parent." + firstEntryId)
          .remove();
      }
    }
  }

  addMaterialOption() {
    var container = document.getElementById("materials-container");

    var rowId = new Date().getTime();
    var row = document.createElement("div");
    row.classList.add("w3-row", "w3-section");
    row.id = rowId;

    var selectDiv = createMaterialSelect(rowId);
    row.appendChild(selectDiv);
    row.appendChild(
      createMaterialInputValue(rowId, selectDiv.dataset.selectId)
    );
    container.appendChild(row);

    return rowId;
  }
}
