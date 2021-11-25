/**
 * @jest-environment jsdom
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import JobView from "../../src/jobs/jobView";
import MockDate from "mockdate";
import Run from "../../src/run";

const removeAllModalPath = resolve(
  __dirname,
  "..",
  "..",
  "src",
  "views",
  "jobs",
  "removeAllJobsModal.html"
);
const removeAllJobsModal = readFileSync(removeAllModalPath, {
  encoding: "utf8",
  flag: "r",
});

const jobsViewPath = resolve(
  __dirname,
  "..",
  "..",
  "src",
  "views",
  "jobs",
  "jobsView.html"
);
const jobsView = readFileSync(jobsViewPath, {
  encoding: "utf8",
  flag: "r",
});

var controls;
beforeEach(() => {
  document.body.innerHTML = `<html><body>
    ${removeAllJobsModal}
    ${jobsView}
    </body></html>`;

  controls = {
    openModal: jest.fn(),
    closeModal: jest.fn(),
    displayAlert: jest.fn(),
  };
});

afterEach(() => {
  MockDate.reset();
});

describe("bindAddJob", () => {
  test("calls handler on click", () => {
    var mockHandler = jest.fn();
    var view = new JobView(controls);
    view.bindAddJob(mockHandler);

    var btn = document.getElementById("add-job-btn");
    btn.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});
describe("bindRemoveAllJobs", () => {
  test("calls handler on click", () => {
    var mockHandler = jest.fn();
    var view = new JobView(controls);
    view.bindRemoveAllJobs(mockHandler);

    var btn = document.getElementById("remove-all-jobs-btn");
    btn.disabled = false;
    btn.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});
describe("bindRemoveAllConfirm", () => {
  test("calls handler on click", () => {
    var mockHandler = jest.fn();
    var view = new JobView(controls);
    view.bindRemoveAllConfirm(mockHandler);

    var btn = document.getElementById("remove-all-jobs-confirm-btn");
    btn.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});
describe("bindRemoveAllCancel", () => {
  test("calls handler on click", () => {
    var mockHandler = jest.fn();
    var view = new JobView(controls);
    view.bindRemoveAllCancel(mockHandler);

    var btn = document.getElementById("remove-all-jobs-cancel-btn");
    btn.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});

describe("bindRemoveJob", () => {
  test("calls handler with data", () => {
    var mockHandler = jest.fn();
    var view = new JobView(controls);
    view.bindRemoveJob(mockHandler);
    // append to document
    var btn = view._createRemoveJobButton({ uuid: "testUUID" });
    document.getElementById("jobs-table-body").appendChild(btn);
    btn.click();

    expect(mockHandler).toHaveBeenCalledWith("testUUID");
  });
});
describe("bindToggleCollapseRow", () => {
  test("calls handler with data", () => {
    var mockHandler = jest.fn();
    var view = new JobView(controls);
    view.bindToggleCollapseRow(mockHandler);
    // append to document
    var span = view._createDetailsToggle("row1");
    document.getElementById("jobs-table-body").appendChild(span);
    span.click();

    expect(mockHandler).toHaveBeenCalledWith("row1");
  });
});

describe("bindToggleCollapseAll", () => {
  test("calls handler", () => {
    var mockHandler = jest.fn();
    var view = new JobView(controls);
    view.bindToggleCollapseAll(mockHandler);
    document.getElementById("toggle-collapse-all").click();

    expect(mockHandler).toHaveBeenCalled();
  });
});

describe("bindEditJob", () => {
  test("calls handler with data", () => {
    var mockHandler = jest.fn();
    var view = new JobView(controls);
    view.bindEditJob(mockHandler);
    // append to document
    var btn = view._createEditJobButton({ uuid: "testUUID" });
    document.getElementById("jobs-table-body").appendChild(btn);
    btn.click();

    expect(mockHandler).toHaveBeenCalledWith("testUUID");
  });
});

describe("toggleDetailsRow", () => {
  test("adds correct classes", () => {
    var view = new JobView(controls);

    var fakeDetailsRow = document.createElement("div");
    fakeDetailsRow.id = "job-details-foo";

    var fakeIcon = document.createElement("i");
    fakeIcon.id = "details-toggle-foo";

    var body = document.getElementById("jobs-table-body");
    body.appendChild(fakeDetailsRow);
    body.appendChild(fakeIcon);

    // should collapse
    view.toggleDetailsRow("foo");
    expect(fakeIcon.classList).toContain("fa-chevron-down");
    expect(fakeIcon.classList).not.toContain("fa-chevron-up");
    expect(fakeDetailsRow.hidden).toBeTruthy();

    // should expand
    view.toggleDetailsRow("foo");
    expect(fakeIcon.classList).not.toContain("fa-chevron-down");
    expect(fakeIcon.classList).toContain("fa-chevron-up");
    expect(fakeDetailsRow.hidden).toBeFalsy();
  });
});

describe("expandAll and collapseAll", () => {
  var view;
  var expandIcon;
  var expandedDetailsRow;
  var collapseIcon;
  var collapsedDetailsRow;

  beforeEach(() => {
    view = new JobView(controls);

    var expandedRow = document.createElement("tr");
    expandedRow.dataset.jobId = "expand";

    var expandName = document.createElement("td");
    expandIcon = document.createElement("i");
    expandIcon.id = "details-toggle-expand";
    expandIcon.classList.add("fa-chevron-up");
    expandName.appendChild(expandIcon);
    expandName.appendChild(document.createTextNode("expand"));
    expandedRow.appendChild(expandName);

    expandedDetailsRow = document.createElement("tr");
    expandedDetailsRow.id = "job-details-expand";

    // clean up the placeholder
    var body = document.getElementById("jobs-table-body");
    body.children[0].remove();

    body.appendChild(expandedRow);
    body.appendChild(expandedDetailsRow);

    var collapsedRow = document.createElement("tr");
    collapsedRow.dataset.jobId = "collapse";

    var collapseName = document.createElement("td");
    collapseIcon = document.createElement("i");
    collapseIcon.id = "details-toggle-collapse";
    collapseIcon.classList.add("fa-chevron-down");
    collapseName.appendChild(collapseIcon);
    collapseName.appendChild(document.createTextNode("collapsed"));
    collapsedRow.appendChild(collapseName);

    collapsedDetailsRow = document.createElement("tr");
    collapsedDetailsRow.id = "job-details-collapse";

    body.appendChild(collapsedRow);
    body.appendChild(collapsedDetailsRow);
  });

  test("collapseAll collapses all rows", () => {
    view.collapseAll();
    expect(expandIcon.classList).toContain("fa-chevron-down");
    expect(expandIcon.classList).not.toContain("fa-chevron-up");
    expect(expandedDetailsRow.hidden).toBeTruthy();

    expect(collapseIcon.classList).toContain("fa-chevron-down");
    expect(collapseIcon.classList).not.toContain("fa-chevron-up");
    expect(collapsedDetailsRow.hidden).toBeTruthy();

    var toggleIcon = document.getElementById("toggle-collapse-all");
    expect(toggleIcon.classList).toContain("fa-angle-double-down");
    expect(toggleIcon.classList).not.toContain("fa-angle-double-up");
  });
  test("expandAll expands all rows", () => {
    view.expandAll();
    expect(expandIcon.classList).not.toContain("fa-chevron-down");
    expect(expandIcon.classList).toContain("fa-chevron-up");
    expect(expandedDetailsRow.hidden).toBeFalsy();

    expect(collapseIcon.classList).not.toContain("fa-chevron-down");
    expect(collapseIcon.classList).toContain("fa-chevron-up");
    expect(collapsedDetailsRow.hidden).toBeFalsy();

    var toggleIcon = document.getElementById("toggle-collapse-all");
    expect(toggleIcon.classList).not.toContain("fa-angle-double-down");
    expect(toggleIcon.classList).toContain("fa-angle-double-up");
  });
});

describe("updateJobStatus", () => {
  test("updates in progress time", () => {
    var view = new JobView(controls);

    // set it to be 30 seconds ago
    var now = new Date();
    var timeAgo = new Date(now.getTime() - 30 * 1000);
    // set time to return 25 seconds ago whenever it is invoked
    MockDate.set(timeAgo.getTime() + 25 * 1000);

    var fakeJob = {
      uuid: "foo",
      entryTime: timeAgo,
      durationSeconds: 60,
    };

    var span = document.createElement("span");
    span.id = "job-status-foo";
    document.body.appendChild(span);

    var badge = document.createElement("span");
    badge.id = "job-remaining-foo";
    document.body.appendChild(badge);

    view.updateJobStatus([fakeJob]);
    expect(span.textContent).toContain("In Progress");
    // 60 - 25s
    expect(badge.textContent).toContain("35s");
  });
  test("updates Done time", () => {
    var view = new JobView(controls);

    // set it to be 10 seconds ago
    var now = new Date();
    var timeAgo = new Date(now.getTime() - 10 * 1000);
    // set time to return 15 seconds ahead (so 5 in the future)
    MockDate.set(timeAgo.getTime() + 15 * 1000);

    var fakeJob = {
      uuid: "foo",
      entryTime: timeAgo,
      durationSeconds: 10,
    };

    var span = document.createElement("span");
    span.id = "job-status-foo";
    document.body.appendChild(span);

    var badge = document.createElement("span");
    badge.id = "job-remaining-foo";
    document.body.appendChild(badge);

    // the job should now be done since the current date will be in the future
    view.updateJobStatus([fakeJob]);
    expect(span.textContent).toContain("Done");
    expect(badge.textContent).toBe("");
  });
});

describe("showJobs", () => {
  test("hides container on null jobs", () => {
    var view = new JobView(controls);
    view.showJobs(null);
    expect(document.getElementById("jobs-view-container").hidden).toBeTruthy();
  });
  test("displays container on with jobs", () => {
    var view = new JobView(controls);
    var run1 = new Run("jobId1", "j1", "PYR-L6", "10s", 10, 55, new Date());

    view.showJobs([run1]);
    expect(document.getElementById("jobs-view-container").hidden).toBeFalsy();
  });
  test("hides footer without jobs", () => {
    var view = new JobView(controls);
    view.showJobs([]);
    var footer = document.getElementById("jobs-table-footer");
    expect(footer.hidden).toBeTruthy();
  });
  test("disables removeAll button without jobs", () => {
    var view = new JobView(controls);
    view.showJobs([]);
    var removeAllButton = document.getElementById("remove-all-jobs-btn");
    expect(removeAllButton.disabled).toBeTruthy();
    expect(removeAllButton.classList).toContain("w3-disabled");
  });
  test("enables removeAll button", () => {
    var view = new JobView(controls);
    var run1 = new Run("jobId1", "j1", "PYR-L6", "10s", 10, 55, new Date());

    view.showJobs([run1]);
    var removeAllButton = document.getElementById("remove-all-jobs-btn");
    expect(removeAllButton.disabled).toBeFalsy();
    expect(removeAllButton.classList).not.toContain("w3-disabled");
  });
  test("renders jobs without materials", () => {
    var view = new JobView(controls);
    var run1 = new Run("jobId1", "j1", "PYR-L6", "10s", 10, 55, new Date());
    var run2 = new Run("jobId2", "j2", "PYR-L7", "20s", 20, 25, new Date());

    // freeze time 5 secs in future
    var now = new Date();
    MockDate.set(now.getTime() + 5 * 1000);

    view.showJobs([run1, run2]);
    var tableBody = document.getElementById("jobs-table-body");
    var rows = tableBody.children;

    expect(rows.length).toBe(2);

    var row1 = rows[0];
    expect(row1.classList).toContain("w3-white");
    expect(row1.dataset.jobId).toBe("jobId1");
    expect(row1.children[0].textContent).toBe("j1");
    expect(row1.children[1].textContent).toBe("PYR-L6");
    expect(row1.children[2].textContent).toBe("10s");
    expect(row1.children[3].textContent).toBe("5s");
    expect(row1.children[4].textContent).toBe("55");
    expect(row1.children[5].textContent).toBe("In Progress");

    var row2 = rows[1];
    expect(row2.classList).toContain("w3-light-grey");
    expect(row2.dataset.jobId).toBe("jobId2");
    expect(row2.children[0].textContent).toBe("j2");
    expect(row2.children[1].textContent).toBe("PYR-L7");
    expect(row2.children[2].textContent).toBe("20s");
    expect(row2.children[3].textContent).toBe("15s");
    expect(row2.children[4].textContent).toBe("25");
    expect(row2.children[5].textContent).toBe("In Progress");
  });
  test("renders jobs with materials", () => {
    var view = new JobView(controls);
    var run1 = new Run("jobId1", "j1", "PYR-L6", "10s", 10, 55, new Date(), {
      Bexalite: 25,
      Laranite: 15,
    });

    view.showJobs([run1]);
    var tableBody = document.getElementById("jobs-table-body");
    var rows = tableBody.children;

    // 2 rows , 1 for materials
    expect(rows.length).toBe(2);

    var row1 = rows[0];
    expect(row1.classList).toContain("w3-white");
    var nameCol = row1.children[0];
    // should contain an expand/collapse button and one for text
    expect(nameCol.childNodes.length).toBe(2);

    var row2 = rows[1];
    expect(row2.classList).toContain("w3-white");
    expect(row2.id).toBe("job-details-jobId1");

    var materialTable = row2.children[4];
    // one row for headers and one for each material
    var materialChildren = materialTable.children;
    expect(materialChildren.length).toBe(3);

    var header = materialChildren[0];
    expect(header.textContent).toBe("Materials");

    var materialRow1 = materialChildren[1];
    expect(materialRow1.children[0].textContent).toBe("Bexalite");
    expect(materialRow1.children[1].textContent).toBe("25");

    var materialRow2 = materialChildren[2];
    expect(materialRow2.children[0].textContent).toBe("Laranite");
    expect(materialRow2.children[1].textContent).toBe("15");
  });
  test("shows total on footer", () => {
    var view = new JobView(controls);
    var run1 = new Run("jobId1", "j1", "PYR-L6", "10s", 10, 55, new Date());
    var run2 = new Run("jobId2", "j2", "PYR-L7", "20s", 20, 25, new Date());

    view.showJobs([run1, run2]);

    var yieldTotal = document.getElementById("jobs-table-footer-yield");
    expect(yieldTotal.textContent).toBe("80");
  });
});

describe("modals", () => {
  test("openRemoveAllModal", () => {
    var view = new JobView(controls);
    view.openRemoveAllModal();

    expect(controls.openModal).toHaveBeenCalledWith("remove-all-jobs-modal");
  });
  test("closeRemoveAllModal", () => {
    var view = new JobView(controls);
    view.closeRemoveAllModal();

    expect(controls.closeModal).toHaveBeenCalledWith("remove-all-jobs-modal");
  });
});
describe("alerts", () => {
  test("alertJobRemoved", () => {
    var view = new JobView(controls);
    view.alertJobRemoved();
    expect(controls.displayAlert).toHaveBeenCalledWith("Refinery Job Removed.");
  });
  test("alertJobRemoved", () => {
    var view = new JobView(controls);
    view.alertAllJobsRemoved();
    expect(controls.displayAlert).toHaveBeenCalledWith(
      "All Refinery Jobs Removed."
    );
  });
});
