/**
 * @jest-environment jsdom
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import JobView from "../../src/jobs/jobView";

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
    ${jobsView}
    </body></html>`;

  controls = {
    openModal: jest.fn(),
    closeModal: jest.fn(),
    displayAlert: jest.fn()
  };
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
      expect(controls.displayAlert).toHaveBeenCalledWith("All Refinery Jobs Removed.");
    });
  });