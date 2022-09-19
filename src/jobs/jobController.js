import {
  getNextDirection,
  getSortField,
  SortDirection,
} from "./sorting/sortOptions";

/**
 * Component that manages Refinery Jobs
 */
export default class JobController {
  constructor(jobModel, jobView, jobEntryController, sortController) {
    this.jobModel = jobModel;
    this.jobView = jobView;
    this.jobEntryController = jobEntryController;
    this.sortController = sortController;

    this.jobView.bindAddJob(this.handleAddJob.bind(this));
    this.jobView.bindEditJob(this.handleEditJob.bind(this));
    this.jobView.bindRemoveJob(this.handleRemoveJob.bind(this));
    this.jobView.bindRemoveAllJobs(this.handleRemoveAllJobs.bind(this));
    this.jobView.bindRemoveAllConfirm(
      this.handleRemoveAllJobsConfirm.bind(this)
    );
    this.jobView.bindRemoveAllCancel(this.handleRemoveAllJobsCancel.bind(this));
    this.jobView.bindToggleCollapseRow(this.handleToggleDetails.bind(this));
    this.jobView.bindToggleCollapseAll(this.handleToggleCollapseAll.bind(this));

    this.jobModel.registerOnJobChangeListener(
      this.onJobChangeHandler.bind(this)
    );

    this.jobView.bindToggleSort(this.handleToggleSort.bind(this));

    // expand all by default
    this.expandAll = true;
  }

  /**
   * Callback to be notified when the state of jobs change
   * @param {Run[]} jobs
   */
  onJobChangeHandler(jobs) {
    this.jobView.showJobs(this.sortController.getSorted(jobs));
    this._synchronizeExpandCollapseAll();
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

  _synchronizeExpandCollapseAll() {
    if (this.expandAll) {
      this.jobView.expandAll();
    } else {
      this.jobView.collapseAll();
    }
  }
  handleToggleCollapseAll() {
    this.expandAll = !this.expandAll;
    this._synchronizeExpandCollapseAll();
  }

  handleEditJob(jobId) {
    var jobData = this.jobModel.get(jobId);
    this.jobEntryController.openEditJobModal(jobData);
  }

  handleToggleSort(field) {
    const currSort = this.sortController.getCurrentSort();
    const currDirection = currSort ? currSort.direction : SortDirection.NONE;

    var sortField = getSortField(field);

    // set new
    if (!currSort) {
      var direction = getNextDirection(currDirection);
      if (direction == SortDirection.NONE) {
        this.sortController.clearSorts();
      } else {
        this.sortController.setSorting(sortField, direction);
      }
    } else {
      // same field, same logic applies
      if (currSort.field == sortField) {
        var direction = getNextDirection(currDirection);
        if (direction == SortDirection.NONE) {
          this.sortController.clearSorts();
        } else {
          this.sortController.setSorting(sortField, direction);
        }
      } else {
        // direction for new field should be right after NONE
        var direction = getNextDirection(SortDirection.NONE);
        this.sortController.setSorting(sortField, direction);
      }
    }

    // ask view to display state and repaint
    this.jobView.updateSortState(this.sortController.getCurrentSort());
    this.jobView.showJobs(
      this.sortController.getSorted(this.jobModel.getAll())
    );
  }
}
