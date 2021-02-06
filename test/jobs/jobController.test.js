import JobController from "../../src/jobs/jobController";

var jobEntryController;
var jobView;
var jobModel;

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
    openRemoveAllModal: jest.fn(),
    closeRemoveAllModal: jest.fn(),
    alertJobRemoved: jest.fn(),
    alertAllJobsRemoved: jest.fn(),
    toggleDetailsRow: jest.fn(),
    showJobs: jest.fn(),
    updateJobStatus: jest.fn(),
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
});

describe("constructor", () => {
  test("binds to view", () => {
    var controller = new JobController(jobModel, jobView, jobEntryController);

    expect(jobView.bindAddJob).toHaveBeenCalled();
  });
});
