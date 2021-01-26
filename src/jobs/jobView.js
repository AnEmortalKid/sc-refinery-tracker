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
    var action = (event) => {
      // todo get event id somehow
      handler(event.target.dataset.jobId);
    };

    this.removeJobAction = action;
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

  /**
   * 
   * @param {Run} job 
   */
  _createJobRow(job) {
  //   <tr>
  //   <th>Name</th>
  //   <th>Location</th>
  //   <th>Duration</th>
  //   <th>Time Remaining</th>
  //   <th>Yield Units</th>
  //   <th>Status</th>
  //   <th>Actions</th>
  // </tr>
    //   <tr>
    //   <td>Borase/Laranite</td>
    //   <td>CRU-L1</td>
    //   <td>21d 43m</td>
    //   <td>15h 22m 3s</td>
    //   <td>1500</td>
    //   <td>
    //     <span class="w3-tag w3-padding-small w3-round w3-amber w3-center">In Progress</span>
    //   </td>
    //   <td>
    //     <div class="w3-bar">
    //       <button class="w3-btn w3-blue-grey w3-round-xlarge"><i class="fa fa-cube"></i></button>
    //       <button class="w3-btn w3-blue w3-round-xlarge"><i class="fa fa-pencil-square-o fa-lg"></i></button>
    //       <button class="w3-btn w3-red w3-round-xlarge"><i class="fa fa-trash fa-lg"></i></button>
    //     </div>
    //   </td>
    // </tr>

    var row = document.createElement("tr");
    row.dataset.jobId = job.uuid;

    var name = document.createElement("td");
    name.textContent = job.name;
    row.appendChild(name);

    var location = document.createElement("td");
    location.textContent = job.location;
    row.appendChild(location);

    var duration = document.createElement('td');
    duration.textContent = job.duration;
    row.appendChild(duration);

    // TODO compute time remaining
    var timeRemaining = document.createElement('td');
    timeRemaining.textContent = toDurationString(job.durationSeconds);
    row.appendChild(timeRemaining);

    var yieldUnits = document.createElement('td');
    yieldUnits.textContent = job.yieldAmount;
    row.appendChild(yieldUnits);

    // TODO row.appendChild(_createActionBar(job));

    return row;
  }

  showJobs(jobs) {
    // TODO handle null

    var jobCount = jobs.length;

    var tableBody = document.getElementById("jobs-table-body");
    removeChildren(tableBody);
    // remove all

    var removeAllButton = document.getElementById("remove-all-jobs-btn");
    if (jobCount == 0) {
      removeAllButton.disabled = true;
      removeAllButton.classList.add("w3-disabled");
      return;
    }
    // we have jobs, enable the button
    removeAllButton.disabled = false;
    removeAllButton.classList.remove("w3-disabled");


    // layout rows
    for (var i = 0; i < jobCount; i++) {
      var job = jobs[i];
      tableBody.appendChild(this._createJobRow(job));
      // TODO create materials row
    }

    // setup footer
  }

  // TODO
  //  add a function here to update time remaining and status only
}
