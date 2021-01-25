import { jobEntry } from "../app";

/**
 * Component that manages Refinery Jobs
 */
export default class JobController {
  // TODO add job entry controller
  constructor(jobModel, jobView, jobEntryController) {
    this.jobModel = jobModel;
    this.jobView = jobView;
    this.jobEntryController = jobEntryController;

    this.jobView.bindAddJob(this.handleAddJob.bind(this));
  }

  onJobChangeHandler(jobs) {
    this.jobView.showJobs(jobs);
  }

  handleAddJob() {
    this.jobEntryController.prepareEntryJobModal();
  }
}
