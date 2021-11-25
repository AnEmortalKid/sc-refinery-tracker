import SettingsController from "../../src/settings/settingsController";

var mockModel;
var mockView;

beforeEach(() => {
  mockModel = {
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    registerOnSettingsChangeListener: jest.fn(),
  };
  mockView = {
    bindOpenSettings: jest.fn(),
    bindConfirmSettings: jest.fn(),
    bindCancelSettings: jest.fn(),

    openSettingsModal: jest.fn(),
    closeSettingsModal: jest.fn(),

    updateButtons: jest.fn(),
    alertSettingsUpdated: jest.fn(),
  };
});

describe("constructor", () => {
  test("binds to view", () => {
    new SettingsController(mockModel, mockView);

    expect(mockView.bindOpenSettings).toHaveBeenCalled();
    expect(mockView.bindConfirmSettings).toHaveBeenCalled();
    expect(mockView.bindCancelSettings).toHaveBeenCalled();
  });
});

describe("load", () => {
  test("calls updateButtons", () => {
    var controller = new SettingsController(mockModel, mockView);

    controller.load("someUser");

    expect(mockView.updateButtons).toHaveBeenCalledWith("someUser");
  });
});

describe("handleEditSettings", () => {
  test("calls with stored settings", () => {
    mockModel.get.mockReturnValueOnce({ refreshRateSeconds: 15 });

    var controller = new SettingsController(mockModel, mockView);
    // pretend an event set the user for us
    controller.onUserChangeHandler("newUser");
    controller.handleEditSettings();

    expect(mockView.openSettingsModal).toHaveBeenCalledWith("newUser", {
      refreshRateSeconds: 15,
    });
  });
});

describe("handleConfirmUpdateSettings", () => {
  test("stores data from form", () => {
    var formData = { "refresh.interval": 10 };

    var controller = new SettingsController(mockModel, mockView);
    controller.load("currentUser");
    controller.handleConfirmUpdateSettings(formData);

    expect(mockModel.update).toHaveBeenCalledWith("currentUser", {
      refreshRateSeconds: 10,
    });
    expect(mockView.closeSettingsModal).toHaveBeenCalled();
    expect(mockView.alertSettingsUpdated).toHaveBeenCalled();
  });
});

describe("handleCancelUpdateSettings", () => {
  test("closes modal", () => {
    var controller = new SettingsController(mockModel, mockView);
    controller.handleCancelUpdateSettings();

    expect(mockView.closeSettingsModal).toHaveBeenCalled();
  });
});
