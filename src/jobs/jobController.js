/**
 * Component that manages Refinery Jobs
 */
export default class JobController {
  constructor(jobModel, jobView, jobEntryController) {
    this.jobModel = jobModel;
    this.jobView = jobView;
    this.jobEntryController = jobEntryController;

    this.jobView.bindAddJob(this.handleAddJob.bind(this));
    this.jobView.bindEditJob(this.handleEditJob.bind(this));
    this.jobView.bindRemoveJob(this.handleRemoveJob.bind(this));
    this.jobView.bindRemoveAllJobs(this.handleRemoveAllJobs.bind(this));
    this.jobView.bindRemoveAllConfirm(
      this.handleRemoveAllJobsConfirm.bind(this)
    );
    this.jobView.bindRemoveAllCancel(this.handleRemoveAllJobsCancel.bind(this));
    this.jobView.bindToggleCollapseRow(this.handleToggleDetails.bind(this));

    this.jobModel.registerOnJobChangeListener(
      this.onJobChangeHandler.bind(this)
    );
  }

  /**
   * Callback to be notified when the state of jobs change
   * @param {Run[]} jobs
   */
  onJobChangeHandler(jobs) {
    this.jobView.showJobs(jobs);
  }

  /**
   * Callback to be notified when the current user changes
   * @param {String} the name of the user
   */
  onUserChangeHandler(currentUser) {
    if (currentUser) {
      this.jobModel.load(currentUser);
    } else {
      this.jobModel.clear();
    }
  }

  onUserDeletedHandler(deleted) {
    if (deleted) {
      this.jobModel.deleteAllForUser(deleted);
    }
  }

  /**
   * Refreshes the status components of all jobs
   */
  refreshJobStatus() {
    var jobs = this.jobModel.getAll();
    this.jobView.updateJobStatus(jobs);
  }

  /**
   * Handles the result of clicking the Add Job button
   */
  handleAddJob() {
    this.jobEntryController.openAddJobModal();
  }

  /**
   * Handles the result of clicking the Remove All button
   */
  handleRemoveAllJobs() {
    this.jobView.openRemoveAllModal();
  }

  /**
   * Handles the result of confirming the Remove All Modal
   */
  handleRemoveAllJobsConfirm() {
    this.jobModel.deleteAll();
    this.jobView.closeRemoveAllModal();
    this.jobView.alertAllJobsRemoved();
  }

  /**
   * Handles the result of canceling the Remove All Modal
   */
  handleRemoveAllJobsCancel() {
    this.jobView.closeRemoveAllModal();
  }

  /**
   * Handles the result of clicking the trash icon on a job row
   */
  handleRemoveJob(jobId) {
    this.jobModel.delete(jobId);
    this.jobView.alertJobRemoved();
  }

  handleToggleDetails(jobId) {
    this.jobView.toggleDetailsRow(jobId);
  }

  handleEditJob(jobId) {
    var jobData = this.jobModel.get(jobId);
    this.jobEntryController.openEditJobModal(jobData);
  }
}
