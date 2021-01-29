import SettingsModel from "../../src/settings/settingsModel";
const key = "mining_tracker.user_settings";

afterEach(() => {
  localStorage.clear();
});

describe("get", () => {
  test("non existent returns default", () => {
    var model = new SettingsModel();

    var defaulted = model.get("nonexistent");
    expect(defaulted.refreshRateSeconds).toBe(1);
  });
  test("existent", () => {
    var val = JSON.stringify({ foo: { refreshRateSeconds: 10 } });
    localStorage.setItem(key, val);

    var model = new SettingsModel();

    var defaulted = model.get("foo");
    expect(defaulted.refreshRateSeconds).toBe(10);
  });
});

describe("update", () => {
  test("updates settings", () => {
    var val = JSON.stringify({ foo: { refreshRateSeconds: 10 } });
    localStorage.setItem(key, val);

    var model = new SettingsModel();

    model.update("foo", { refreshRateSeconds: 2 });

    var allSettings = JSON.parse(localStorage.getItem(key));
    expect(allSettings["foo"].refreshRateSeconds).toBe(2);
  });
});

describe("delete", () => {
  test("deletes settings", () => {
    var val = JSON.stringify({ foo: { refreshRateSeconds: 10 } });
    localStorage.setItem(key, val);

    var model = new SettingsModel();
    model.delete("foo");

    var allSettings = JSON.parse(localStorage.getItem(key));
    expect(allSettings).not.toHaveProperty("foo");
  });
});

describe("onChangeListener", () => {
  test("fires on settings set", () => {
    var mockListener = jest.fn();

    var val = JSON.stringify({ foo: { refreshRateSeconds: 10 } });
    localStorage.setItem(key, val);

    var model = new SettingsModel();
    model.registerOnSettingsChangeListener(mockListener);

    model.update("foo", { refreshRateSeconds: 2 });

    expect(mockListener).toHaveBeenCalledWith({ refreshRateSeconds: 2 });
  });
  test("fires on user cleared", () => {
    var mockListener = jest.fn();

    var val = JSON.stringify({ foo: { refreshRateSeconds: 10 } });
    localStorage.setItem(key, val);

    var model = new SettingsModel();
    model.registerOnSettingsChangeListener(mockListener);
    model.delete("foo");

    expect(mockListener).toHaveBeenCalledWith(null);
  });
  test("does not fire for no change", () => {
    var mockListener = jest.fn();

    var val = JSON.stringify({ foo: { refreshRateSeconds: 10 } });
    localStorage.setItem(key, val);

    var model = new SettingsModel();
    model.registerOnSettingsChangeListener(mockListener);
    model.update("foo", { refreshRateSeconds: 10 });

    expect(mockListener).not.toHaveBeenCalled();
  });
});
