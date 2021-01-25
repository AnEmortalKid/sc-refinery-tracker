/**
 * Component responsible for displaying a list of Refinery Jobs
 */
export default class JobView {
  constructor() {
    this.tableBody = document.getElementById("jobs-table-body");
    this.tableFooter = document.getElementById("runs-table-footer");
    this.tableFooterYieldColumn = document.getElementById(
      "runs-table-footer-yield"
    );
  }

  showJobs(jobs) {
    console.log(`jobs:${jobs}`);
  }

  /**
   * Binds the event of clicking the Add Job button
   * @param {function} handler a handler to invoke when the add job button is pressed
   */
  bindAddJob(handler) {
    //onclick="app.controls.openModal('add-job-modal')"
    var action = (event) => {
      handler();
    };

    var btn = document.getElementById("add-job-btn");
    btn.addEventListener("click", action);
  }

  /**
   * Binds the event of clicking the Remove All Jobs button
   * @param {function} handler a handler to invoke when the remove all jobs button is pressed
   */
  bindRemoveAllJobs(handler) {
    var action = (event) => {
      handler();
    };
  }

  /**
   * Binds the event of clicking the Remove job button for a specific row
   * @param {*} handler a handler to invoke when the remove job button is pressed
   */
  bindRemoveJob(handler) {
    var action = (event) => {
      // todo get event id somehow
      handler(event.target.dataset.jobId);
    };
  }
}
