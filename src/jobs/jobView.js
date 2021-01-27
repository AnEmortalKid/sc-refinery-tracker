import { removeChildren } from "../elementUtils";
import { toDurationString } from "../durationParser";

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

    var btn = document.getElementById("remove-all-jobs-btn");
    btn.addEventListener("click", action);
  }

  /**
   * Binds the event of clicking the Remove job button for a specific row
   * @param {*} handler a handler to invoke when the remove job button is pressed
   */
  bindRemoveJob(handler) {
    this.removeJobHandler = handler;
  }

  /**
   * Binds the event of clicking the Confirm button for the Remove All Jobs Modal
   * @param {*} handler a handler to invoke when the remove job button is pressed
   */
  bindRemoveAllConfirm(handler) {
    var action = (event) => {
      handler();
    };

    var btn = document.getElementById("remove-all-jobs-confirm-btn");
    btn.addEventListener("click", action);
  }

  /**
   * Binds the event of clicking the Confirm button for the Remove All Jobs Modal
   * @param {*} handler a handler to invoke when the remove job button is pressed
   */
  bindRemoveAllCancel(handler) {
    var action = (event) => {
      handler();
    };

    var cancelButton = document.getElementById("remove-all-jobs-cancel-btn");
    cancelButton.addEventListener("click", action);

    var closeModalButton = document.getElementById(
      "remove-all-jobs-modal-close-button"
    );
    closeModalButton.addEventListener("click", action);
  }

  /**
   * Open the Remove All Jobs Modal
   */
  openRemoveAllModal() {
    app.controls.openModal("remove-all-jobs-modal");
  }

  /**
   * Closes the modal
   */
  closeRemoveAllModal() {
    app.controls.closeModal("remove-all-jobs-modal");
  }

  _createActionsRow(job) {
    var row = document.createElement("td");

    var rowDiv = document.createElement("div");
    rowDiv.classList.add("w3-bar");

    var removeJobButton = document.createElement("button");
    removeJobButton.classList.add("w3-btn", "w3-red", "w3-round-xlarge");
    removeJobButton.addEventListener("click", () =>
      this.removeJobHandler(job.uuid)
    );

    var removeIcon = document.createElement("i");
    removeIcon.classList.add("fa", "fa-trash", "fa-lg");
    removeJobButton.appendChild(removeIcon);

    rowDiv.append(removeJobButton);

    row.appendChild(rowDiv);
    return row;
  }

  _getTimeRemaining(job) {
    var nowSeconds = Math.round(new Date().getTime() / 1000);
    var entrySeconds = Math.round(new Date(job.entryTime).getTime() / 1000);
    var ellapsedSeconds = nowSeconds - entrySeconds;
    return job.durationSeconds - ellapsedSeconds;
  }

  _setSpanStatus(span, remainingSeconds) {
    if (remainingSeconds > 0) {
      span.classList.add("w3-amber");
      span.textContent = "In Progress";
    } else {
      span.classList.add("w3-green");
      span.textContent = "Done";
    }
  }

  _setTimeRemaining(column, remainingSeconds) {
    column.textContent = toDurationString(remainingSeconds);
  }

  /**
   * @param {Run} job
   */
  _createJobRow(job) {
    var row = document.createElement("tr");
    row.dataset.jobId = job.uuid;

    var name = document.createElement("td");
    name.textContent = job.name;
    row.appendChild(name);

    var location = document.createElement("td");
    location.textContent = job.location;
    row.appendChild(location);

    var duration = document.createElement("td");
    duration.textContent = job.duration;
    row.appendChild(duration);

    var remainingSeconds = this._getTimeRemaining(job);
    var timeRemaining = document.createElement("td");
    timeRemaining.id = "job-remaining-" + job.uuid;
    this._setTimeRemaining(timeRemaining, remainingSeconds);
    row.appendChild(timeRemaining);

    var yieldUnits = document.createElement("td");
    yieldUnits.textContent = job.yieldAmount;
    row.appendChild(yieldUnits);

    var status = document.createElement("td");
    var statusSpan = document.createElement("span");
    statusSpan.classList.add("w3-tag", "w3-padding-small");
    statusSpan.id = "job-status-" + job.uuid;
    this._setSpanStatus(statusSpan, remainingSeconds);

    status.appendChild(statusSpan);
    row.appendChild(status);

    row.appendChild(this._createActionsRow(job));
    return row;
  }

  /**
   * Displays the given jobs
   * @param {Run[]} jobs
   */
  showJobs(jobs) {
    if (!jobs) {
      // hide it all
      document.getElementById("jobs-view-container").hidden = true;
      return;
    }
    document.getElementById("jobs-view-container").hidden = false;

    var tableBody = document.getElementById("jobs-table-body");
    removeChildren(tableBody);

    var removeAllButton = document.getElementById("remove-all-jobs-btn");
    var footer = document.getElementById("jobs-table-footer");
    var jobCount = jobs.length;
    if (jobCount == 0) {
      removeAllButton.disabled = true;
      removeAllButton.classList.add("w3-disabled");
      footer.hidden = true;
      return;
    }
    // we have jobs, enable the ui
    removeAllButton.disabled = false;
    removeAllButton.classList.remove("w3-disabled");
    footer.hidden = false;

    // layout rows
    for (var i = 0; i < jobCount; i++) {
      var job = jobs[i];
      tableBody.appendChild(this._createJobRow(job));
      // TODO create materials row
    }

    var yieldTotal = 0;
    for (var i = 0; i < jobCount; i++) {
      yieldTotal += jobs[i].yieldAmount;
    }

    // setup footer
    var yieldTotalColumn = document.getElementById("jobs-table-footer-yield");
    yieldTotalColumn.textContent = yieldTotal;
  }

  /**
   * Updates the status portions of the given jobs
   * @param {Run[]} jobs
   */
  updateJobStatus(jobs) {
    if (!jobs) {
      // the ui will not be displayed, do nothing
      return;
    }

    for (var i = 0; i < jobs.length; i++) {
      var job = jobs[i];

      var remainingSeconds = this._getTimeRemaining(job);
      var spanCol = document.getElementById("job-status-" + job.uuid);
      this._setSpanStatus(spanCol, remainingSeconds);

      var timeLeftCol = document.getElementById("job-remaining-" + job.uuid);
      this._setTimeRemaining(timeLeftCol, remainingSeconds);
    }
  }
}
