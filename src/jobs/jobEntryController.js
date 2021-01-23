/**
 * Component that manages the entry and update of a Refinery Job
 */
export default class JobEntryController {
  constructor(jobEntryView) {
    this.jobEntryView = jobEntryView;

    this.jobEntryView.bindSubmitJob(this.handleJobEntry);
  }

  /**
   * Toggles between allowing a user to enter a single yield amount or a set of materials that compose the total yield
   */
  toggleMaterialEntryMode() {
    this.jobEntryView.toggleMaterialEntryMode(event.target.checked);
  }

  addMaterialEntryOption() {
    this.jobEntryView.addMaterialOption();
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
  }
}
