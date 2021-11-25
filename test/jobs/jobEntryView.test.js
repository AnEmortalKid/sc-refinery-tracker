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
    displayAlert: jest.fn(),
  };
});

describe("bindAddMaterial", () => {
  test("calls handler on click", () => {
    var mockHandler = jest.fn();
    var view = new JobEntryView(controls);
    view.bindAddMaterial(mockHandler);

    var btn = document.getElementById("add-job-form-add-material");
    btn.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});
describe("bindToggleMaterialsMode", () => {
  test("calls handler on click", () => {
    var mockHandler = jest.fn();
    var view = new JobEntryView(controls);
    view.bindToggleMaterialsMode(mockHandler);

    var btn = document.getElementById("add-job-form-entryMode");
    btn.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});

describe("bindSubmitJob", () => {
  test("calls handler on click", () => {
    var mockHandler = jest.fn();
    var view = new JobEntryView(controls);
    view.bindSubmitJob(mockHandler);

    var btn = document.getElementById("add-job-form-confirm-btn");
    btn.disabled = false;
    btn.click();

    expect(mockHandler).toHaveBeenCalled();
  });
  test("calls handler on submit", () => {
    var mockHandler = jest.fn();
    var view = new JobEntryView(controls);
    view.bindSubmitJob(mockHandler);

    var form = document.getElementById("add-job-form");
    form.submit();

    expect(mockHandler).toHaveBeenCalled();
  });
});

describe("data submission", () => {
  test("passes total yield data", () => {
    var mockHandler = jest.fn();
    var view = new JobEntryView(controls);
    view.bindSubmitJob(mockHandler);

    var form = document.getElementById("add-job-form");
    // setup data
    var formInputs = form.querySelectorAll("input");
    formInputs[0].value = "SomeName";

    var select = document.getElementById("add-job-select-location");
    // add a fake option
    var fakeOption = document.createElement("option");
    fakeOption.value = "PYR-L3";
    fakeOption.textContent = "PYR-L3";
    fakeOption.selected = true;
    select.appendChild(fakeOption);
    select.value = "PYR-L3";

    // days, hours, minutes, seconds
    formInputs[1].value = 1;
    formInputs[2].value = 2;
    formInputs[3].value = 3;
    formInputs[4].value = 4;

    // yield amount is after the checkbox
    formInputs[6].value = 55;

    form.submit();

    expect(mockHandler).toHaveBeenCalledWith({
      name: "SomeName",
      location: "PYR-L3",
      "duration.days": "1",
      "duration.hours": "2",
      "duration.minutes": "3",
      "duration.seconds": "4",
      yieldAmount: "55",
    });
  });
  test("passes materials data", () => {
    var mockHandler = jest.fn();
    var view = new JobEntryView(controls);
    view.bindSubmitJob(mockHandler);

    var form = document.getElementById("add-job-form");
    // setup data
    var formInputs = form.querySelectorAll("input");
    formInputs[0].value = "SomeName";

    var select = document.getElementById("add-job-select-location");
    // add a fake option
    var fakeOption = document.createElement("option");
    fakeOption.value = "PYR-L3";
    fakeOption.textContent = "PYR-L3";
    fakeOption.selected = true;
    select.appendChild(fakeOption);
    select.value = "PYR-L3";

    // days, hours, minutes, seconds
    formInputs[1].value = 1;
    formInputs[2].value = 2;
    formInputs[3].value = 3;
    formInputs[4].value = 4;

    // enable materials checkbox
    formInputs[5].checked = true;

    // add two options
    view.addMaterialOption(false, false, { name: "Bexalite", value: "20" });
    view.addMaterialOption(false, false, { name: "Titanium", value: "25" });
    form.submit();

    expect(mockHandler).toHaveBeenCalledWith({
      name: "SomeName",
      location: "PYR-L3",
      "duration.days": "1",
      "duration.hours": "2",
      "duration.minutes": "3",
      "duration.seconds": "4",
      yieldAmount: "0",
      materialEntries: [
        {
          // need selection to mark form invalid
          name: "Bexalite",
          value: 20,
          selectId: "materials-select-0",
        },
        {
          // need selection to mark form invalid
          name: "Titanium",
          value: 25,
          selectId: "materials-select-1",
        },
      ],
    });
  });
});

describe("form modes", () => {
  test("toggleMaterial Mode adds option", () => {
    var mockHandler = jest.fn();
    var view = new JobEntryView(controls);
    view.bindOnFormDataChange(mockHandler);

    view.toggleMaterialEntryMode(true);

    var container = document.getElementById("materials-container");
    expect(container.children.length).toBe(1);
    // adding an entry also notifies by default
    expect(mockHandler).toHaveBeenCalled();
  });

  test("addMaterialOption notifies form change", () => {
    var mockHandler = jest.fn();
    var view = new JobEntryView(controls);
    view.bindOnFormDataChange(mockHandler);

    view.addMaterialOption();

    var container = document.getElementById("materials-container");
    expect(container.children.length).toBe(1);
    // adding an entry also notifies by default
    expect(mockHandler).toHaveBeenCalled();
  });
});

describe("bindOnFormDataChange", () => {
  test("calls bound handler with data on change", () => {
    var mockHandler = jest.fn();
    var view = new JobEntryView(controls);
    view.bindOnFormDataChange(mockHandler);

    var select = document.getElementById("add-job-select-location");
    // add a fake option
    var fakeOption = document.createElement("option");
    fakeOption.value = "PYR-L6";
    fakeOption.textContent = "PYR-L6";
    fakeOption.selected = true;
    select.appendChild(fakeOption);
    select.value = "PYR-L6";

    var event = new Event("change");
    select.dispatchEvent(event);

    expect(mockHandler).toHaveBeenCalledWith({
      name: "",
      location: "PYR-L6",
      "duration.days": "",
      "duration.hours": "",
      "duration.minutes": "",
      "duration.seconds": "",
      yieldAmount: "0",
    });
  });
});

describe("bindCancelEntryForm", () => {
  test("calls handler on cancel button", () => {
    var mockHandler = jest.fn();
    var view = new JobEntryView(controls);
    view.bindCancelEntryForm(mockHandler);

    var btn = document.getElementById("add-job-form-cancel-btn");
    btn.click();

    expect(mockHandler).toHaveBeenCalled();
  });
  test("calls handler on close button", () => {
    var mockHandler = jest.fn();
    var view = new JobEntryView(controls);
    view.bindCancelEntryForm(mockHandler);

    var btn = document.getElementById("add-job-modal-close-button");
    btn.click();

    expect(mockHandler).toHaveBeenCalled();
  });
});

describe("toggle submit", () => {
  test("enable", () => {
    var view = new JobEntryView(controls);
    view.toggleSubmitButton(true);

    var btn = document.getElementById("add-job-form-confirm-btn");
    expect(btn.disabled).toBeFalsy();
    expect(btn.classList).not.toContain("w3-disabled");
  });
  test("disable", () => {
    var view = new JobEntryView(controls);
    view.toggleSubmitButton(false);

    var btn = document.getElementById("add-job-form-confirm-btn");
    expect(btn.disabled).toBeTruthy();
    expect(btn.classList).toContain("w3-disabled");
  });
});

describe("validation", () => {
  test("markLocationValidity false", () => {
    var view = new JobEntryView(controls);
    view.markLocationValidity(false);

    var select = document.getElementById("add-job-select-location");
    expect(select.classList).toContain("w3-border-red");
  });

  test("markLocationValidity true", () => {
    var view = new JobEntryView(controls);

    var select = document.getElementById("add-job-select-location");
    select.classList.add("w3-border-red");

    view.markLocationValidity(true);
    expect(select.classList).not.toContain("w3-border-red");
  });

  test("markMaterialEntryValidity false", () => {
    var view = new JobEntryView(controls);
    view.addMaterialOption(true, false, { name: "Quantainium", value: "25" });
    view.addMaterialOption(true, false, { name: "Quantainium", value: "35" });

    var materialDropdown = document.getElementById("materials-select-1");
    view.markMaterialEntryValidity("materials-select-1", false);

    expect(materialDropdown.classList).toContain("w3-border-red");
  });
  test("markMaterialEntryValidity true", () => {
    var view = new JobEntryView(controls);
    view.addMaterialOption(true, false, { name: "Quantainium", value: "25" });
    view.addMaterialOption(true, false, { name: "Quantainium", value: "35" });

    var materialDropdown = document.getElementById("materials-select-1");
    materialDropdown.classList.add("w3-border-red");

    view.markMaterialEntryValidity("materials-select-1", true);
    expect(materialDropdown.classList).not.toContain("w3-border-red");
  });
});

describe("modal controls", () => {
  test("openAddEntryModal", () => {
    var view = new JobEntryView(controls);
    view.openAddEntryModal();
    expect(controls.openModal).toHaveBeenCalledWith("add-job-modal");
    var header = document.getElementById("job-modal-header-placeholder");
    expect(header.textContent).toEqual("Add Refinery Job");
  });
  test("openAddEntryModal with clear", () => {
    var view = new JobEntryView(controls);
    view.bindOnFormDataChange(jest.fn());

    var form = document.getElementById("add-job-form");
    // setup data
    var formInputs = form.querySelectorAll("input");
    formInputs[0].value = "SomeName";

    var select = document.getElementById("add-job-select-location");
    // add a fake option
    var fakeOption = document.createElement("option");
    fakeOption.value = "PYR-L3";
    fakeOption.textContent = "PYR-L3";
    fakeOption.selected = true;
    select.appendChild(fakeOption);
    select.value = "PYR-L3";

    // days, hours, minutes, seconds
    formInputs[1].value = 1;
    formInputs[2].value = 2;
    formInputs[3].value = 3;
    formInputs[4].value = 4;
    // yield amount is after the checkbox
    formInputs[6].value = 55;

    view.openAddEntryModal(true);

    // it should reset the form
    expect(formInputs[0].value).toBe("");
    expect(formInputs[1].value).toBe("");
    expect(formInputs[2].value).toBe("");
    expect(formInputs[3].value).toBe("");
    expect(formInputs[4].value).toBe("");
    expect(formInputs[6].value).toBe("0");
    // first option is the placeholder
    expect(select.value).toBe("");
    var defaultOption = select.children[0];
    expect(defaultOption.disabled).toBeTruthy();
    expect(defaultOption.selected).toBeTruthy();
  });
  test("openAddEntryModal with clear removes materials", () => {
    var view = new JobEntryView(controls);
    view.bindOnFormDataChange(jest.fn());

    var container = document.getElementById("materials-container");
    var fakeRow = document.createElement("div");
    container.appendChild(fakeRow);
    view.openAddEntryModal(true);

    expect(container.children.length).toBe(0);
  });
  test("openEditEntryModal", () => {
    var view = new JobEntryView(controls);
    view.bindOnFormDataChange(jest.fn());

    view.openEditEntryModal({});
    expect(controls.openModal).toHaveBeenCalledWith("add-job-modal");
    var header = document.getElementById("job-modal-header-placeholder");
    expect(header.textContent).toEqual("Edit Refinery Job");
  });
  test("openEditEntryModal with data", () => {
    var view = new JobEntryView(controls);
    view.bindOnFormDataChange(jest.fn());

    view.openEditEntryModal({ name: "someJob" });
    expect(controls.openModal).toHaveBeenCalledWith("add-job-modal");
    var header = document.getElementById("job-modal-header-placeholder");
    expect(header.textContent).toEqual("Edit someJob");
  });
  test("openEditEntryModal with materials adds options", () => {
    var view = new JobEntryView(controls);
    view.bindOnFormDataChange(jest.fn());
    view.openEditEntryModal({
      name: "someJob",
      materialEntries: [{ name: "Quantainium", value: 20 }],
    });

    var container = document.getElementById("materials-container");
    expect(container.children.length).toBe(1);
    // sets the mode
    expect(
      document.getElementById("add-job-form-entryMode").checked
    ).toBeTruthy();
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
