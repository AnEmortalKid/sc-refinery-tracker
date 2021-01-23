import { toDurationString } from "./durationParser";
import { removeChildren } from "./elementUtils";

const removeAllBtnId = "remove-all-jobs-btn";

function createActionBar(run) {
  /**
   * Creates a td like:
   * <td>
   *   <div class="w3-bar">
   *     <button class="w3-btn w3-red w3-round-xlarge" onclick>
   *       <i class="fa fa-trash fa-lg"></i>
   *     </button>
   *   </div>
   * </td>
   */
  var tableData = document.createElement("td");

  var buttonBar = document.createElement("div");
  buttonBar.classList = ["w3-bar"];

  var removeJobButton = document.createElement("button");
  removeJobButton.classList.add("w3-btn", "w3-red", "w3-round-xlarge");

  var trashIcon = document.createElement("i");
  trashIcon.classList.add("fa", "fa-trash", "fa-lg");

  removeJobButton.appendChild(trashIcon);
  removeJobButton.onclick = () => app.removeRun(run);

  buttonBar.appendChild(removeJobButton);
  tableData.appendChild(buttonBar);

  return tableData;
}

export default class RunView {
  constructor(userController, runController) {
    this.userController = userController;
    this.runController = runController;
  }

  layout() {
    if (!this.userController.getCurrentUser()) {
      document.getElementById("refinery-tracker-container").hidden = true;
      return;
    }

    document.getElementById("refinery-tracker-container").hidden = false;
    document.getElementById("runs-table-footer").hidden = false;

    var runs = this.runController.fetch();
    if (runs.length == 0) {
      document
        .getElementById("remove-all-jobs-btn")
        .classList.add("w3-disabled");
      document.getElementById("runs-table-footer").hidden = true;
    } else {
      document
        .getElementById("remove-all-jobs-btn")
        .classList.remove("w3-disabled");
    }

    var table = document.getElementById("runs-table");

    var tableBody = table.getElementsByTagName("tbody")[0];
    removeChildren(tableBody);

    var yieldTotal = 0;
    runs.forEach((run) => {
      var row = document.createElement("tr");

      var name = document.createElement("td");
      name.textContent = run.name;
      row.appendChild(name);

      var location = document.createElement("td");
      location.textContent = run.location;
      row.appendChild(location);

      var duration = document.createElement("td");
      duration.textContent = run.duration;
      row.appendChild(duration);

      var now = new Date();
      var nowSeconds = Math.round(now.getTime() / 1000);

      var entrySeconds = Math.round(new Date(run.entryTime).getTime() / 1000);
      var ellapsedSeconds = nowSeconds - entrySeconds;
      var remainingSeconds = run.durationSeconds - ellapsedSeconds;

      var timeRemaining = document.createElement("td");
      timeRemaining.textContent = toDurationString(remainingSeconds);
      row.appendChild(timeRemaining);

      var yieldData = document.createElement("td");
      yieldData.textContent = run.yieldAmount;
      row.appendChild(yieldData);
      yieldTotal += parseInt(run.yieldAmount);

      // <span class="w3-tag w3-padding-small w3-round w3-orange w3-center">In Progress</span>
      var status = document.createElement("td");
      var statusTag = document.createElement("span");
      statusTag.classList.add("w3-tag", "w3-padding-small", "w3-round");
      if (remainingSeconds > 1) {
        statusTag.classList.add("w3-amber");
        statusTag.textContent = "In Progress";
      } else {
        statusTag.classList.add("w3-green");
        statusTag.textContent = "Done";
      }
      status.appendChild(statusTag);
      row.appendChild(status);

      row.appendChild(createActionBar(run.uuid));

      tableBody.appendChild(row);
    });

    // set footer
    document.getElementById("runs-table-footer-yield").textContent = yieldTotal;
  }

  isValidEntry(runEntry) {
    // TODO move to better location and use a change listener

    var selecter = document.getElementById("add-job-select-location");
    if (!runEntry.location) {
      if (!selecter.classList.contains("w3-border-red")) {
        selecter.classList.add("w3-border-red");
      }
      return false;
    }

    selecter.classList.remove("w3-border-red");
    return true;
  }
}