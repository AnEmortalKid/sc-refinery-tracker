import UserController from "../../src/users/userController";

var mockModel;
var mockView;

beforeEach(() => {
  mockModel = {
    add: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
    getAll: jest.fn(),
    setCurrent: jest.fn(),
    getCurrent: jest.fn(),
    clearCurrent: jest.fn(),
    registerOnUserChangeListener: jest.fn(),
    registerOnUserDeletedListener: jest.fn(),
  };
  mockView = {
    bindAddUser: jest.fn(),
    bindConfirmAddUser: jest.fn(),
    bindCancelAddUserForm: jest.fn(),

    bindRemoveUser: jest.fn(),
    bindConfirmRemoveUser: jest.fn(),
    bindCancelRemoveUser: jest.fn(),

    bindOnUserChange: jest.fn(),

    openAddUserModal: jest.fn(),
    closeAddUserModal: jest.fn(),
    openRemoveUserModal: jest.fn(),
    closeRemoveUserModal: jest.fn(),
    updateButtons: jest.fn(),
    showUsers: jest.fn(),
    alertUserAdded: jest.fn(),
    alertUserRemoved: jest.fn(),
  };
});

describe("constructor", () => {
  test("binds to view", () => {
    new UserController(mockModel, mockView);
    expect(mockView.bindAddUser).toHaveBeenCalled();
    expect(mockView.bindConfirmAddUser).toHaveBeenCalled();
    expect(mockView.bindCancelAddUserForm).toHaveBeenCalled();
    expect(mockView.bindRemoveUser).toHaveBeenCalled();
    expect(mockView.bindConfirmRemoveUser).toHaveBeenCalled();
    expect(mockView.bindCancelRemoveUser).toHaveBeenCalled();
    expect(mockView.bindOnUserChange).toHaveBeenCalled();
  });
});

describe("Adding a User", () => {
  test("opening dialog", () => {
    var controller = new UserController(mockModel, mockView);

    // pretend the view notifies
    controller.handleAddUser();

    expect(mockView.openAddUserModal).toHaveBeenCalled();
  });
  test("submitting a user", () => {
    var controller = new UserController(mockModel, mockView);
    controller.submitAddUser("newUser");

    expect(mockModel.add).toHaveBeenCalled();
    expect(mockModel.setCurrent).toHaveBeenCalledWith("newUser");
    expect(mockView.closeAddUserModal).toHaveBeenCalled();
    expect(mockView.showUsers).toHaveBeenCalled();
    expect(mockView.alertUserAdded).toHaveBeenCalled();
  });
  test("closing dialog", () => {
    var controller = new UserController(mockModel, mockView);

    // pretend the view notifies
    controller.handleAddUserCancel();

    expect(mockView.closeAddUserModal).toHaveBeenCalled();
  });
});

describe("Removing a User", () => {
  test("opening dialog", () => {
    var controller = new UserController(mockModel, mockView);

    // pretend the view notifies
    controller.handleRemoveUser();

    expect(mockView.openRemoveUserModal).toHaveBeenCalled();
  });
  test("removing a user", () => {
    var controller = new UserController(mockModel, mockView);
    controller.handleConfirmRemoveUser("newUser");

    expect(mockModel.delete).toHaveBeenCalledWith("newUser");
    expect(mockModel.clearCurrent).toHaveBeenCalled();
    expect(mockView.closeRemoveUserModal).toHaveBeenCalled();
    expect(mockView.showUsers).toHaveBeenCalled();
    expect(mockView.alertUserRemoved).toHaveBeenCalled();
  });
  test("closing dialog", () => {
    var controller = new UserController(mockModel, mockView);

    // pretend the view notifies
    controller.handleRemoveUserCancel();

    expect(mockView.closeRemoveUserModal).toHaveBeenCalled();
  });
});

describe("changing user", () => {
  test("change user", () => {
    var controller = new UserController(mockModel, mockView);

    // pretend the view notifies
    controller.handleOnUserChange("oldUser");

    expect(mockModel.setCurrent).toHaveBeenCalledWith("oldUser");
    expect(mockView.updateButtons).toHaveBeenCalledWith("oldUser");
  });
});
