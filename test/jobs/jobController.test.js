import JobController from "../../src/jobs/jobController";

var jobEntryController;
var jobView;
var jobModel;
var sortController;

beforeEach(() => {
  jobModel = {
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

  jobView = {
    bindAddJob: jest.fn(),
    bindEditJob: jest.fn(),
    bindRemoveAllJobs: jest.fn(),
    bindRemoveJob: jest.fn(),
    bindRemoveAllConfirm: jest.fn(),
    bindRemoveAllCancel: jest.fn(),
    bindToggleCollapseRow: jest.fn(),
    bindToggleCollapseAll: jest.fn(),
    openRemoveAllModal: jest.fn(),
    closeRemoveAllModal: jest.fn(),
    alertJobRemoved: jest.fn(),
    alertAllJobsRemoved: jest.fn(),
    toggleDetailsRow: jest.fn(),
    expandAll: jest.fn(),
    collapseAll: jest.fn(),
    showJobs: jest.fn(),
    updateJobStatus: jest.fn(),
    bindToggleSort: jest.fn(),
  };

  jobEntryController = {
    toggleMaterialEntryMode: jest.fn(),
    addMaterialEntryOption: jest.fn(),
    handleCancelJobEntry: jest.fn(),
    onFormChange: jest.fn(),
    handleJobEntry: jest.fn(),
    openAddJobModal: jest.fn(),
    openEditJobModal: jest.fn(),
  };

  sortController = {
    getSorted: jest.fn(),
    clearSorts: jest.fn(),
    setSorting: jest.fn(),
    getCurrentSort: jest.fn(),
  };
});

function createController() {
  return new JobController(
    jobModel,
    jobView,
    jobEntryController,
    sortController
  );
}

describe("constructor", () => {
  test("binds to view", () => {
    createController();

    expect(jobView.bindAddJob).toHaveBeenCalled();
    expect(jobView.bindEditJob).toHaveBeenCalled();
    expect(jobView.bindRemoveJob).toHaveBeenCalled();
    expect(jobView.bindRemoveAllJobs).toHaveBeenCalled();
    expect(jobView.bindRemoveAllConfirm).toHaveBeenCalled();
    expect(jobView.bindRemoveAllCancel).toHaveBeenCalled();
    expect(jobView.bindToggleCollapseRow).toHaveBeenCalled();
    expect(jobView.bindToggleCollapseAll).toHaveBeenCalled();
    expect(jobModel.registerOnJobChangeListener).toHaveBeenCalled();
    expect(jobView.bindToggleSort).toHaveBeenCalled();
  });
});

describe("onJobChangeHandler", () => {
  test("calls showJobs", () => {
    // prevent no sort
    sortController.getSorted.mockReturnValue([{ uuid: "foo" }]);
    var controller = createController();

    controller.onJobChangeHandler([{ uuid: "foo" }]);

    expect(jobView.showJobs).toHaveBeenCalledWith([{ uuid: "foo" }]);
  });
  test("preserves collapsed state", () => {
    var controller = createController();
    controller.expandAll = false;

    controller.onJobChangeHandler([{ uuid: "foo" }]);

    expect(jobView.collapseAll).toHaveBeenCalled();
  });
});
describe("onuserChangeHandler", () => {
  test("with null user, calls clear", () => {
    var controller = createController();
    controller.onUserChangeHandler(null);

    expect(jobModel.clear).toHaveBeenCalled();
  });
  test("with user, calls load", () => {
    var controller = createController();

    controller.onUserChangeHandler("user");
    expect(jobModel.load).toHaveBeenCalledWith("user");
  });
});

describe("onUserDeletedHandler", () => {
  test("null user, does nothing", () => {
    var controller = createController();
    controller.onUserDeletedHandler(null);

    expect(jobModel.deleteAllForUser).not.toHaveBeenCalled();
  });
  test("deletes runs for user", () => {
    var controller = createController();
    controller.onUserDeletedHandler("deleted");

    expect(jobModel.deleteAllForUser).toHaveBeenCalledWith("deleted");
  });
});

describe("refreshJobStatus", () => {
  test("loads runs from model", () => {
    var mockJobs = [{ uuid: "foo" }, { uuid: "bar" }];
    jobModel.getAll.mockReturnValueOnce(mockJobs);

    var controller = createController();

    controller.refreshJobStatus();

    expect(jobModel.getAll).toHaveBeenCalled();
    expect(jobView.updateJobStatus).toHaveBeenCalledWith(mockJobs);
  });
});

describe("handleAddJob", () => {
  test("opens modal", () => {
    var controller = createController();

    controller.handleAddJob();
    expect(jobEntryController.openAddJobModal).toHaveBeenCalled();
  });
});

describe("handleRemoveAllJobs", () => {
  test("opens modal", () => {
    var controller = createController();

    controller.handleRemoveAllJobs();
    expect(jobView.openRemoveAllModal).toHaveBeenCalled();
  });
});

describe("handleRemoveAllJobsConfirm", () => {
  test("closes remove modal and removes jobs", () => {
    var controller = createController();

    controller.handleRemoveAllJobsConfirm();
    expect(jobModel.deleteAll).toHaveBeenCalled();
    expect(jobView.closeRemoveAllModal).toHaveBeenCalled();
    expect(jobView.alertAllJobsRemoved).toHaveBeenCalled();
  });
});

describe("handleRemoveAllJobsCancel", () => {
  test("closes remove modal", () => {
    var controller = createController();

    controller.handleRemoveAllJobsCancel();
    expect(jobView.closeRemoveAllModal).toHaveBeenCalled();
  });
});

describe("handleRemoveJob", () => {
  test("removes job", () => {
    var controller = createController();

    controller.handleRemoveJob("someId");
    expect(jobModel.delete).toHaveBeenCalledWith("someId");
    expect(jobView.alertJobRemoved).toHaveBeenCalled();
  });
});

describe("handleToggleDetails", () => {
  test("toggles row", () => {
    var controller = createController();
    controller.handleToggleDetails("someRow");
    expect(jobView.toggleDetailsRow).toHaveBeenCalledWith("someRow");
  });
});

describe("handleToggleCollapseAll", () => {
  test("collapsesAll", () => {
    var controller = createController();
    controller.handleToggleCollapseAll();
    expect(jobView.collapseAll).toHaveBeenCalled();
  });
  test("expandsAll", () => {
    var controller = createController();
    // pretend we collapsed b4
    controller.expandAll = false;
    controller.handleToggleCollapseAll();
    expect(jobView.expandAll).toHaveBeenCalled();
  });
});

describe("handleEditJob", () => {
  test("loads edit data", () => {
    jobModel.get.mockReturnValueOnce({ uuid: "someJob" });

    var controller = createController();
    controller.handleEditJob("someJob");
    expect(jobModel.get).toHaveBeenCalledWith("someJob");
    expect(jobEntryController.openEditJobModal).toHaveBeenCalledWith({
      uuid: "someJob",
    });
  });
});
