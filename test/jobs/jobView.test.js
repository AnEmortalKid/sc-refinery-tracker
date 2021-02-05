/**
 * @jest-environment jsdom
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import JobView from "../../src/jobs/jobView";

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

describe("updateJobStatus", () => {});

describe("showJobs", () => {});

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
