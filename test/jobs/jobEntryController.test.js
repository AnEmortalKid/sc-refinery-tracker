import JobEntryController from "../../src/jobs/jobEntryController";

var mockView;
var mockModel;

beforeEach(() => {
  mockModel = {
    add: jest.fn(),
    load: jest.fn(),
    clear: jest.fn(),
    getAll: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    deleteAll: jest.fn(),
    deleteAllForUser: jest.fn(),
    update: jest.fn(),
    registerOnJobChangeListener: jest.fn(),
  };
  mockView = {
    toggleMaterialEntryMode: jest.fn(),
    addMaterialOption: jest.fn(),

    bindOnFormDataChange: jest.fn(),
    bindToggleMaterialsMode: jest.fn(),
    bindAddMaterial: jest.fn(),
    bindSubmitJob: jest.fn(),

    bindCancelEntryForm: jest.fn(),

    openAddEntryModal: jest.fn(),
    openEditEntryModal: jest.fn(),
    closeEntryModal: jest.fn(),
    toggleSubmitButton: jest.fn(),
    markLocationValidity: jest.fn(),
    markMaterialEntryValidity: jest.fn(),
    alertJobAdded: jest.fn(),
  };
});

describe("toggleMaterialEntryMode", () => {
  test("calls toggleMaterialMode", () => {
    var controller = new JobEntryController(mockModel, mockView);

    controller.toggleMaterialEntryMode({ target: { checked: true } });
    expect(mockView.toggleMaterialEntryMode).toHaveBeenCalledWith(true);
  });
});

describe("addMaterialEntryOption", () => {
  test("calls addMaterialOption", () => {
    var controller = new JobEntryController(mockModel, mockView);

    controller.addMaterialEntryOption();
    expect(mockView.addMaterialOption).toHaveBeenCalled();
  });
});

describe("handleCancelJobEntry", () => {
  test("calls closeEntryModal", () => {
    var controller = new JobEntryController(mockModel, mockView);

    controller.handleCancelJobEntry();
    expect(mockView.closeEntryModal).toHaveBeenCalled();
  });
});

describe("onFormChange", () => {
  test("invalid form", () => {
    var controller = new JobEntryController(mockModel, mockView);

    controller.onFormChange({});
    expect(mockView.markLocationValidity).toHaveBeenCalledWith(false);
    expect(mockView.toggleSubmitButton).toHaveBeenCalledWith(false);
  });

  test("valid location form", () => {
    var controller = new JobEntryController(mockModel, mockView);

    controller.onFormChange({ location: "HUR-L6" });
    expect(mockView.markLocationValidity).toHaveBeenCalledWith(true);
    expect(mockView.toggleSubmitButton).toHaveBeenCalledWith(true);
  });
  test("invalid materials form", () => {
    var controller = new JobEntryController(mockModel, mockView);

    controller.onFormChange({
      location: "HUR-L6",
      materialEntries: [
        { name: "Quantainium", value: 55, selectId: 1 },
        { name: "Quantainium", value: 55, selectId: 2 },
      ],
    });
    expect(mockView.markMaterialEntryValidity).toHaveBeenCalledWith(1, true);
    expect(mockView.markMaterialEntryValidity).toHaveBeenCalledWith(2, false);
    expect(mockView.toggleSubmitButton).toHaveBeenCalledWith(false);
  });
  test("valid materials form", () => {
    var controller = new JobEntryController(mockModel, mockView);

    controller.onFormChange({
      location: "HUR-L6",
      materialEntries: [
        { name: "Quantainium", value: 55, selectId: 1 },
        { name: "Bexalite", value: 55, selectId: 2 },
      ],
    });
    expect(mockView.markMaterialEntryValidity).toHaveBeenCalledWith(1, true);
    expect(mockView.markMaterialEntryValidity).toHaveBeenCalledWith(2, true);
    expect(mockView.toggleSubmitButton).toHaveBeenCalledWith(true);
  });
});

describe("handleJobEntry", () => {
  test("invalid form, shortcircuits", () => {
    var controller = new JobEntryController(mockModel, mockView);

    controller.handleJobEntry({});
    expect(mockModel.add).not.toHaveBeenCalled();
    expect(mockModel.update).not.toHaveBeenCalled();
  });

  test("valid form, adds run", () => {
    var controller = new JobEntryController(mockModel, mockView);

    var valid = {
      name: "MyJob",
      location: "HUR-L6",
      "duration.days": "0",
      "duration.hours": "1",
      "duration.minutes": "30",
      "duration.seconds": "15",
      yieldAmount: "20",
    };
    controller.handleJobEntry(valid);
    expect(mockModel.add).toHaveBeenCalledWith(
      expect.objectContaining({
        // uuuid is generated
        name: "MyJob",
        location: "HUR-L6",
        duration: "1h 30m 15s",
        durationSeconds: 5415,
        yieldAmount: 20,
      })
    );
  });
  test("valid form, with materials, adds run", () => {
    var controller = new JobEntryController(mockModel, mockView);

    var valid = {
      name: "MyJob",
      location: "HUR-L6",
      "duration.days": "0",
      "duration.hours": "1",
      "duration.minutes": "30",
      "duration.seconds": "15",
      yieldAmount: "20",
      materialEntries: [
        { name: "Quantainum", value: 25, selectId: 1 },
        { name: "Bexalite", value: 30, selectId: 2 },
      ],
    };
    controller.handleJobEntry(valid);
    expect(mockModel.add).toHaveBeenCalledWith(
      expect.objectContaining({
        // uuuid is generated
        name: "MyJob",
        location: "HUR-L6",
        duration: "1h 30m 15s",
        durationSeconds: 5415,
        yieldAmount: 55,
        materials: {
          Quantainum: 25,
          Bexalite: 30,
        },
      })
    );
  });
  test("edit mode, calls edit", () => {
    var controller = new JobEntryController(mockModel, mockView);
    var previousEntry = {
      uuid: "previousUUID",
      entryTime: new Date(),
      name: "MyJob",
      location: "HUR-L6",
      "duration.days": "0",
      "duration.hours": "1",
      "duration.minutes": "30",
      "duration.seconds": "15",
      yieldAmount: "20",
      materialEntries: [
        { name: "Quantainum", value: 25, selectId: 1 },
        { name: "Bexalite", value: 30, selectId: 2 },
      ],
    };
    controller.isEditing = true;
    controller.editJobState = previousEntry;

    var valid = {
      name: "MyJob1",
      location: "HUR-L5",
      "duration.days": "0",
      "duration.hours": "1",
      "duration.minutes": "30",
      "duration.seconds": "16",
      yieldAmount: "60",
      materialEntries: [
        { name: "Quantainum", value: 30, selectId: 1 },
        { name: "Bexalite", value: 30, selectId: 2 },
      ],
    };
    controller.handleJobEntry(valid);
    expect(mockModel.update).toHaveBeenCalledWith(
      expect.objectContaining({
        // we should add everything new BUT uuid and entryTime
        uuid: previousEntry.uuid,
        entryTime: previousEntry.entryTime,
        name: "MyJob1",
        location: "HUR-L5",
        duration: "1h 30m 16s",
        durationSeconds: 5416,
        yieldAmount: 60,
        materials: {
          Quantainum: 30,
          Bexalite: 30,
        },
      })
    );
  });
});

describe("openAddJobModal", () => {
  test("no past mode", () => {
    var controller = new JobEntryController(mockModel, mockView);
    controller.openAddJobModal();

    expect(mockView.openAddEntryModal).toHaveBeenCalledWith(false);
  });
  test("previously editing", () => {
    var controller = new JobEntryController(mockModel, mockView);
    // pretend we previously edited data
    controller.isEditing = true;
    controller.openAddJobModal();

    expect(mockView.openAddEntryModal).toHaveBeenCalledWith(true);
  });
});

describe("openEditJobModal", () => {
  test("sets form data, no materials", () => {
    var controller = new JobEntryController(mockModel, mockView);

    var job = {
      name: "foo",
      location: "HUR-L6",
      duration: "1d 30m 15s",
      durationSeconds: 5415,
      yieldAmount: 55,
    };

    controller.openEditJobModal(job);

    expect(mockView.openEditEntryModal).toHaveBeenCalledWith({
      name: "foo",
      location: "HUR-L6",
      "duration.days": 0,
      "duration.hours": 1,
      "duration.minutes": 30,
      "duration.seconds": 15,
      yieldAmount: 55,
    });
  });
  test("sets form data, with materials", () => {
    var controller = new JobEntryController(mockModel, mockView);

    var job = {
      name: "foo",
      location: "HUR-L6",
      duration: "1d 30m 15s",
      durationSeconds: 5415,
      yieldAmount: 55,
      materials: {
        Quantainum: 25,
        Bexalite: 30,
      },
    };

    controller.openEditJobModal(job);

    expect(mockView.openEditEntryModal).toHaveBeenCalledWith({
      name: "foo",
      location: "HUR-L6",
      "duration.days": 0,
      "duration.hours": 1,
      "duration.minutes": 30,
      "duration.seconds": 15,
      yieldAmount: 55,
      materialEntries: [
        { name: "Quantainum", value: 25 },
        { name: "Bexalite", value: 30 },
      ],
    });
  });
});
