import { removeChildren } from "../elementUtils";
import { toDurationString } from "../durationParser";

/**
 * Component responsible for displaying a list of Refinery Jobs
 */
export default class JobView {
  constructor(controls) {
    this.controls = controls;

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
   * Binds handler to notify when a click event happens on a collapse/expand icon for row
   * @param {function} handler
   */
  bindToggleCollapseRow(handler) {
    this.toggleDetailsHandler = handler;
  }

  /**
   * Binds handler to notify when a click event happens on the edit icon for a row
   * @param {function} handler
   */
  bindEditJob(handler) {
    this.editJobHandler = handler;
  }

  /**
   * Open the Remove All Jobs Modal
   */
  openRemoveAllModal() {
    this.controls.openModal("remove-all-jobs-modal");
  }

  /**
   * Closes the modal
   */
  closeRemoveAllModal() {
    this.controls.closeModal("remove-all-jobs-modal");
  }

  alertJobRemoved() {
    // TODO pass in ids and what not
    this.controls.displayAlert("Refinery Job Removed.");
  }

  alertAllJobsRemoved() {
    // TODO pass in count
    this.controls.displayAlert("All Refinery Jobs Removed.");
  }

  _createRemoveJobButton(job) {
    var button = document.createElement("button");
    button.classList.add(
      "w3-btn",
      "w3-red",
      "w3-round-xlarge",
      "rf-job-actions-btn"
    );
    button.addEventListener("click", () => this.removeJobHandler(job.uuid));

    var icon = document.createElement("i");
    icon.classList.add("fa", "fa-trash", "fa-lg");
    button.appendChild(icon);

    return button;
  }

  _createEditJobButton(job) {
    var button = document.createElement("button");
    button.classList.add(
      "w3-btn",
      "w3-blue",
      "w3-round-xlarge",
      "rf-job-actions-btn"
    );
    button.addEventListener("click", () => {
      this.editJobHandler(job.uuid);
    });

    var icon = document.createElement("i");
    icon.classList.add("fa", "fa-pencil-square-o", "fa-lg");
    button.appendChild(icon);

    return button;
  }

  _createActionsRow(job) {
    var row = document.createElement("td");

    var rowDiv = document.createElement("div");
    rowDiv.classList.add("w3-bar");

    rowDiv.append(this._createEditJobButton(job));
    rowDiv.append(this._createRemoveJobButton(job));

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

  _createDetailsToggle(jobId) {
    var span = document.createElement("span");

    var icon = document.createElement("i");
    icon.classList.add("fa", "fa-chevron-up", "w3-left", "w3-padding-small");
    icon.id = "details-toggle-" + jobId;
    span.appendChild(icon);
    span.addEventListener("click", (event) => {
      this.toggleDetailsHandler(jobId);
    });

    return span;
  }

  toggleDetailsRow(jobId) {
    var detailsRow = document.getElementById("job-details-" + jobId);
    var icon = document.getElementById("details-toggle-" + jobId);
    var hidden = detailsRow.hidden;
    if (hidden) {
      // expand and add collapse icon
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
      detailsRow.hidden = false;
    } else {
      icon.classList.add("fa-chevron-down");
      icon.classList.remove("fa-chevron-up");
      detailsRow.hidden = true;
    }
  }

  _createMaterialsHeader() {
    var cellRow = document.createElement("div");
    cellRow.classList.add("w3-cell-row");

    var cell = document.createElement("div");
    cell.classList.add("w3-cell", "w3-blue-grey");
    var bold = document.createElement("strong");
    bold.appendChild(document.createTextNode("Materials"));
    cell.appendChild(bold);
    cellRow.append(cell);

    return cellRow;
  }

  _createMaterialCellRow(name, quantity) {
    var cellRow = document.createElement("div");
    cellRow.classList.add("w3-cell-row");

    var nameCell = document.createElement("div");
    nameCell.classList.add("w3-cell", "w3-left", "rf-material-data-padding");
    var bold = document.createElement("strong");
    bold.appendChild(document.createTextNode(name));
    nameCell.appendChild(bold);
    cellRow.appendChild(nameCell);

    var quantityCell = document.createElement("div");
    quantityCell.classList.add(
      "w3-cell",
      "w3-right",
      "rf-material-data-padding"
    );
    var span = document.createElement("span");
    span.appendChild(document.createTextNode(quantity));
    quantityCell.appendChild(span);
    cellRow.appendChild(quantityCell);

    return cellRow;
  }

  _createDetailsRow(job) {
    var detailsRow = document.createElement("tr");
    detailsRow.id = "job-details-" + job.uuid;

    // append tds for name,location,duration,time-remaining
    detailsRow.appendChild(document.createElement("td"));
    detailsRow.appendChild(document.createElement("td"));
    detailsRow.appendChild(document.createElement("td"));
    detailsRow.appendChild(document.createElement("td"));

    var materialsCol = document.createElement("td");
    materialsCol.colSpan = 2;
    materialsCol.appendChild(this._createMaterialsHeader());
    for (const [key, value] of Object.entries(job.materials)) {
      materialsCol.appendChild(this._createMaterialCellRow(key, value));
    }
    detailsRow.appendChild(materialsCol);

    // row for actions column
    detailsRow.appendChild(document.createElement("td"));
    return detailsRow;
  }

  /**
   * @param {Run} job
   */
  _createJobRow(job) {
    var row = document.createElement("tr");
    row.dataset.jobId = job.uuid;

    var name = document.createElement("td");
    if (this._hasMaterials(job)) {
      name.appendChild(this._createDetailsToggle(job.uuid));
    }
    name.appendChild(document.createTextNode(job.name));
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

  _hasMaterials(job) {
    return job.materials && Object.keys(job.materials).length > 0;
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
      // create a stripped effect
      var colorClass = i % 2 == 0 ? "w3-white" : "w3-light-grey";

      var jobRow = this._createJobRow(job);
      jobRow.classList.add(colorClass);

      tableBody.appendChild(jobRow);

      // TODO check if null or empty or no keys
      if (this._hasMaterials(job)) {
        var detailsRow = this._createDetailsRow(job);
        detailsRow.classList.add(colorClass);
        tableBody.appendChild(detailsRow);
      }
    }

    var yieldTotal = 0;
    for (var i = 0; i < jobCount; i++) {
      yieldTotal += parseInt(jobs[i].yieldAmount);
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
