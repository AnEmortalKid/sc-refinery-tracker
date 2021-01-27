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
    var existing = [ "foo", "bar"];
    localStorage.setItem(usersDataKey, JSON.stringify(existing));

    const model = new UserModel();
    model.add("foo");

    var rawData = localStorage.getItem(usersDataKey);
    var allData = JSON.parse(rawData);

    expect(allData).toEqual( [ "foo", "bar"]);
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
      var existing = [ "foo", "bar"];
      localStorage.setItem(usersDataKey, JSON.stringify(existing));
  
      const model = new UserModel();
      model.delete("foo");
  
      var rawData = localStorage.getItem(usersDataKey);
      var allData = JSON.parse(rawData);
  
      expect(allData).toEqual(["bar"]);
    });
  });
