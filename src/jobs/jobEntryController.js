import Run from "../run";
import { v4 as uuidv4 } from "uuid";
import { toSeconds } from "../durationParser";

/**
 * Component that manages the entry and update of a Refinery Job
 */
export default class JobEntryController {
  constructor(jobModel, jobEntryView) {
    this.jobModel = jobModel;
    this.jobEntryView = jobEntryView;

    this.jobEntryView.bindSubmitJob(this.handleJobEntry.bind(this));
    this.jobEntryView.bindCancelEntryForm(this.handleCancelJobEntry.bind(this));
    this.jobEntryView.bindToggleMaterialsMode(
      this.toggleMaterialEntryMode.bind(this)
    );
    this.jobEntryView.bindAddMaterial(this.addMaterialEntryOption.bind(this));
    this.jobEntryView.bindOnFormDataChange(this.onFormChange.bind(this));
  }

  /**
   * Toggles between allowing a user to enter a single yield amount or a set of materials that compose the total yield
   */
  toggleMaterialEntryMode(event) {
    this.jobEntryView.toggleMaterialEntryMode(event.target.checked);
  }

  /**
   * Adds an input row to specify a material type and material inputs
   */
  addMaterialEntryOption() {
    this.jobEntryView.addMaterialOption();
  }

  /**
   * Indicates a cancel button was pressed
   */
  handleCancelJobEntry() {
    this.jobEntryView.closeEntryModal();
  }

  /**
   * Handles form changes
   *
   * @param {Object} jobEntry a dictionary containing the current values on the form
   */
  onFormChange(jobEntry) {
    var valid = this._validateEntry(jobEntry);
    this.jobEntryView.toggleSubmitButton(valid);
  }

  /**
   * Handles the submission of a job entry
   * @param {object} jobEntry
   */
  handleJobEntry(jobEntry) {
    var valid = this._validateEntry(jobEntry);
    if (valid) {
      // make new run  and add it

      this.jobModel.add(this._createRun(jobEntry));
      // TODO display alert SUCCESS!
      this.jobEntryView.closeEntryModal();
    }
  }

  prepareEntryJobModal() {
    // if we needed to set any state OR edit the state, we'd do it here in the future
    this.jobEntryView.openEntryModal();
  }

  /**
   * Validates that the form data is correct and has the required fields
   *
   * @param {Object} jobEntry object
   */
  _validateEntry(jobEntry) {
    var valid = true;
    if (!jobEntry["location"]) {
      this.jobEntryView.markLocationValidity(false);
      valid = false;
    } else {
      this.jobEntryView.markLocationValidity(true);
    }

    var materialEntries = jobEntry.materialEntries;
    if (materialEntries) {
      var seenMaterials = [];
      for (var i = 0; i < materialEntries.length; i++) {
        var materialEntry = materialEntries[i];

        // don't allow duplicate materials
        var materialName = materialEntry.name;
        if (seenMaterials.indexOf(materialName) !== -1) {
          this.jobEntryView.markMaterialEntryValidity(
            materialEntry.selectId,
            false
          );
          valid = false;
        } else {
          seenMaterials.push(materialName);
          this.jobEntryView.markMaterialEntryValidity(
            materialEntry.selectId,
            true
          );
        }
      }
    }

    return valid;
  }

  /**
   * Creates a Run object from the form data
   * @param {Object} jobEntry form data
   */
  _createRun(jobEntry) {
    var durationStr = "";
    if (jobEntry["duration.days"] > 0) {
      durationStr += jobEntry["duration.days"] + "d ";
    }
    if (jobEntry["duration.hours"] > 0) {
      durationStr += jobEntry["duration.hours"] + "h ";
    }
    if (jobEntry["duration.minutes"] > 0) {
      durationStr += jobEntry["duration.minutes"] + "m ";
    }
    if (jobEntry["duration.seconds"] > 0) {
      durationStr += jobEntry["duration.seconds"] + "s";
    }
    durationStr = durationStr.trim();
    // if nothing was entered
    if (durationStr == "") {
      durationStr = "0s";
    }

    var yieldAmount = parseInt(jobEntry.yieldAmount) || 0;

    var materials = null;
    var materialEntries = jobEntry.materialEntries;
    if (materialEntries) {
      materials = {};
      yieldAmount = 0;
      for (var i = 0; i < materialEntries.length; i++) {
        var materialEntry = materialEntries[i];
        materials[materialEntry.name] = materialEntry.value;
        yieldAmount += materialEntry.value;
      }
    }

    var uuid = uuidv4();
    var run = new Run(
      uuid,
      jobEntry.name,
      jobEntry.location,
      durationStr,
      toSeconds(durationStr),
      yieldAmount,
      new Date(),
      materials
    );
    return run;
  }
}
