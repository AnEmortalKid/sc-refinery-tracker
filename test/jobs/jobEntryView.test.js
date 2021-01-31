/**
 * @jest-environment jsdom
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import JobEntryView from "../../src/jobs/jobEntryView";

const jobModalPath = resolve(
  __dirname,
  "..",
  "..",
  "src",
  "views",
  "jobs",
  "addJobModal.html"
);
const jobModalView = readFileSync(jobModalPath, {
  encoding: "utf8",
  flag: "r",
});

var controls;
beforeEach(() => {
  document.body.innerHTML = `<html><body>
    ${jobModalView}
    </body></html>`;

  controls = {
    openModal: jest.fn(),
    closeModal: jest.fn(),
    displayAlert: jest.fn()
  };
});


describe("modal controls", () => {
    test("openAddEntryModal", () => {
      var view = new JobEntryView(controls);
      view.openAddEntryModal();
      expect(controls.openModal).toHaveBeenCalledWith("add-job-modal");
    });
    test("openAddEntryModal", () => {
        var view = new JobEntryView(controls);

                // TODO validate data
        view.bindOnFormDataChange(jest.fn())

        view.openEditEntryModal({});
        expect(controls.openModal).toHaveBeenCalledWith("add-job-modal");
      });
    test("closeEntryModal", () => {
      var view = new JobEntryView(controls);
      view.closeEntryModal();
      expect(controls.closeModal).toHaveBeenCalledWith("add-job-modal");
    });
  });
describe("alerts", () => {
    test("alertJobAdded", () => {
      var view = new JobEntryView(controls);
      view.alertJobAdded();
      expect(controls.displayAlert).toHaveBeenCalledWith("Refinery Job Added.");
    });
  });