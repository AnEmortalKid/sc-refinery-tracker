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
  }

  /**
   * Toggles between allowing a user to enter a single yield amount or a set of materials that compose the total yield
   */
  toggleMaterialEntryMode(event) {
    this.jobEntryView.toggleMaterialEntryMode(event.target.checked);
  }

  addMaterialEntryOption() {
    this.jobEntryView.addMaterialOption();
  }

  handleCancelJobEntry() {
    this.jobEntryView.closeEntryModal();
  }

  _validateEntry(jobEntry) {
    var valid = true;
    if (!jobEntry["location"]) {
      this.jobEntryView.markLocationInvalid();
      valid = false;
    }

    return valid;
  }

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

    var yieldAmount = jobEntry.yieldAmount;
    // TODO materials

    var uuid = uuidv4();
    var run = new Run(
      uuid,
      jobEntry.name,
      jobEntry.location,
      durationStr,
      toSeconds(durationStr),
      yieldAmount,
      new Date()
    );
    return run;
  }

  /**
   * Handles the submission of a job entry
   * @param {object} jobEntry
   */
  handleJobEntry(jobEntry) {
    // convert entry data to Run
    // this.model.addRun();
    console.log("handleJobEntry");
    console.log(JSON.stringify(jobEntry));

    var valid = this._validateEntry(jobEntry);
    if (valid) {
      // make new run  and add it

      this.jobModel.add(this._createRun(jobEntry));
      // TODO display alert SUCCESS!
      this.jobEntryView.closeEntryModal();
    }
  }
}
