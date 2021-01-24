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

  /**
   * Handles the submission of a job entry
   * @param {object} jobEntry
   */
  handleJobEntry(jobEntry) {
    // convert entry data to Run
    // this.model.addRun();
    console.log("handleJobEntry");
    console.log(JSON.stringify(jobEntry));

    // make a run

    // TODO who calls validate?

    // TODO call job model
  }
}
