import UserModel from "../../src/users/userModel";

const usersDataKey = "mining_tracker.users";
const currentUserKey = "mining_tracker.user";

afterEach(() => {
  localStorage.clear();
});

describe("add", () => {
  test("non-existent adds to store", () => {
    const model = new UserModel();
    model.add("test");

    var rawData = localStorage.getItem(usersDataKey);
    var allData = JSON.parse(rawData);

    expect(allData).toEqual(["test"]);
  });

  test("does not allow duplicates", () => {
    var existing = ["foo", "bar"];
    localStorage.setItem(usersDataKey, JSON.stringify(existing));

    const model = new UserModel();
    model.add("foo");

    var rawData = localStorage.getItem(usersDataKey);
    var allData = JSON.parse(rawData);

    expect(allData).toEqual(["foo", "bar"]);
  });
});

describe("delete", () => {
  test("does nothing on empty", () => {
    const model = new UserModel();
    model.delete("test");

    var rawData = localStorage.getItem(usersDataKey);
    var allData = JSON.parse(rawData);

    expect(allData).toEqual([]);
  });

  test("removes existing user", () => {
    var existing = ["foo", "bar"];
    localStorage.setItem(usersDataKey, JSON.stringify(existing));

    const model = new UserModel();
    model.delete("foo");

    var rawData = localStorage.getItem(usersDataKey);
    var allData = JSON.parse(rawData);

    expect(allData).toEqual(["bar"]);
  });
});

describe("exists", () => {
  test("non existent", () => {
    var existing = ["foo", "bar"];
    localStorage.setItem(usersDataKey, JSON.stringify(existing));

    const model = new UserModel();
    expect(model.exists("gaz")).toBeFalsy();
  });
  test("existent", () => {
    var existing = ["foo", "bar"];
    localStorage.setItem(usersDataKey, JSON.stringify(existing));

    const model = new UserModel();
    expect(model.exists("foo")).toBeTruthy();
  });
});

describe("getAll", () => {
  test("non existent", () => {
    const model = new UserModel();
    expect(model.getAll()).toEqual([]);
  });
  test("existent", () => {
    var existing = ["foo", "bar"];
    localStorage.setItem(usersDataKey, JSON.stringify(existing));

    const model = new UserModel();
    expect(model.getAll()).toEqual(["foo", "bar"]);
  });
});

describe("setCurrent", () => {
  test("sets initial", () => {
    const model = new UserModel();
    model.setCurrent("current");

    var currentStored = localStorage.getItem(currentUserKey);
    expect(currentStored).toEqual("current");
  });

  test("overwrites current", () => {
    localStorage.setItem(currentUserKey, "Current");

    const model = new UserModel();
    model.setCurrent("newCurrent");

    var currentStored = localStorage.getItem(currentUserKey);
    expect(currentStored).toEqual("newCurrent");
  });
});

describe("getCurrent()", () => {
  test("nothing set, returns null", () => {
    const model = new UserModel();

    expect(model.getCurrent()).toBeNull();
  });
  test("returns current user", () => {
    localStorage.setItem(currentUserKey, "Current");
    const model = new UserModel();

    expect(model.getCurrent()).toEqual("Current");
  });
});

describe("clearCurrent", () => {
  test("clears current user", () => {
    localStorage.setItem(currentUserKey, "Current");
    const model = new UserModel();
    model.clearCurrent();

    var currentStored = localStorage.getItem(currentUserKey);
    expect(currentStored).toBeNull();
  });
});

describe("onChangeListener", () => {
  test("fires on user set", () => {
    var mockListener = jest.fn();

    const model = new UserModel();
    model.registerOnUserChangeListener(mockListener);
    model.setCurrent("newUser");

    expect(mockListener).toHaveBeenCalledWith("newUser");
  });
  test("fires on user cleared", () => {
    var mockListener = jest.fn();

    localStorage.setItem(currentUserKey, "Current");
    const model = new UserModel();
    model.registerOnUserChangeListener(mockListener);
    model.clearCurrent();

    expect(mockListener).toHaveBeenCalledWith(null);
  });
  test("does not fire on same user", () => {
    var mockListener = jest.fn();

    localStorage.setItem(currentUserKey, "newUser");
    const model = new UserModel();
    model.registerOnUserChangeListener(mockListener);
    model.setCurrent("newUser");

    expect(mockListener).not.toHaveBeenCalled();
  });
});

describe("onUserDeleted", () => {
  test("fires on user removed", () => {
    var mockListener = jest.fn();

    var existing = ["foo", "bar"];
    localStorage.setItem(usersDataKey, JSON.stringify(existing));

    const model = new UserModel();
    model.registerOnUserDeletedListener(mockListener);
    model.delete("foo");

    expect(mockListener).toHaveBeenCalledWith("foo");
  });
});
