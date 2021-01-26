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
    this.jobView.bindRemoveJob(this.handleRemoveJob.bind(this));
    this.jobView.bindRemoveAllJobs(this.handleRemoveAllJobs.bind(this));
    this.jobView.bindRemoveAllConfirm(
      this.handleRemoveAllJobsConfirm.bind(this)
    );
    this.jobView.bindRemoveAllCancel(this.handleRemoveAllJobsCancel.bind(this));

    this.jobModel.registerOnJobChangeListener(
      this.onJobChangeHandler.bind(this)
    );
  }

  onJobChangeHandler(jobs) {
    this.jobView.showJobs(jobs);
  }

  handleAddJob() {
    this.jobEntryController.prepareEntryJobModal();
  }

  handleRemoveAllJobs() {
    this.jobView.openRemoveAllModal();
  }

  handleRemoveAllJobsConfirm() {
    this.jobModel.deleteAll();
    this.jobView.closeRemoveAllModal();
  }

  handleRemoveAllJobsCancel() {
    this.jobView.closeRemoveAllModal();
  }

  handleRemoveJob(jobId) {
    this.jobModel.delete(jobId);
  }
}
