import Run from "../run";
import { v4 as uuidv4 } from "uuid";
import { toSeconds, toTimeFragments } from "../durationParser";

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

    this.isEditing = false;
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
    if (!valid) {
      return;
    }

    if (!this.isEditing) {
      this.jobModel.add(this._createRun(jobEntry));
    } else {
      // consolidate the runs, only overwriting what is permissible
      var previousRun = this.editJobState;
      var newRun = this._createRun(jobEntry);

      var consolidatedRun = new Run(
        previousRun.uuid,
        newRun.name,
        newRun.location,
        newRun.duration,
        newRun.durationSeconds,
        newRun.yieldAmount,
        previousRun.entryTime,
        newRun.materials
      );

      this.jobModel.update(consolidatedRun);
    }

    this.jobEntryView.closeEntryModal();
    this.jobEntryView.alertJobAdded();
  }

  /**
   * Opens the modal to add a new Job
   */
  openAddJobModal() {
    // clear data only if our past action was an edit
    var clearData = this.isEditing;

    this.isEditing = false;

    this.jobEntryView.openAddEntryModal(clearData);
  }

  _toEditFormData(job) {
    // to form data
    var formData = {};

    formData["name"] = job.name;
    formData["location"] = job.location;
    formData["yieldAmount"] = job.yieldAmount;

    var timeFragments = toTimeFragments(job.durationSeconds);
    formData["duration.days"] = timeFragments.days;
    formData["duration.hours"] = timeFragments.hours;
    formData["duration.minutes"] = timeFragments.minutes;
    formData["duration.seconds"] = timeFragments.seconds;

    // materials
    if (job.materials) {
      var materialEntries = [];
      for (const [key, value] of Object.entries(job.materials)) {
        materialEntries.push({ name: key, value: value });
      }
      formData.materialEntries = materialEntries;
    }

    return formData;
  }

  /**
   * Opens the modal to Edit a Job
   */
  openEditJobModal(job) {
    this.editJobState = job;
    this.isEditing = true;

    this.jobEntryView.openEditEntryModal(this._toEditFormData(job));
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
