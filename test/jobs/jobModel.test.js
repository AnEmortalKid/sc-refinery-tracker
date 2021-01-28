import JobModel from "../../src/jobs/jobModel";
import Run from "../../src/run";

const key = "mining_tracker.runs";

afterEach(() => {
  localStorage.clear();
});

describe("load", () => {
  test("no data for user loads empty", () => {
    const model = new JobModel();
    model.load("foo");

    expect(model.getAll()).toEqual([]);
  });

  test("existing data loads correctly", () => {
    const runNoMaterials = new Run(
      "uuid1",
      "name1",
      "location1",
      "5s",
      5,
      15,
      new Date()
    );
    const runMaterials = new Run(
      "uuid2",
      "name2",
      "location2",
      "10s",
      10,
      15,
      new Date(),
      {
        Quantainium: 15,
      }
    );
    const expectedRuns = [runMaterials, runNoMaterials];

    var val = JSON.stringify({ foo: expectedRuns });
    localStorage.setItem(key, val);

    const model = new JobModel();
    model.load("foo");

    // JSON.stringify will turn our dates into ISO strings
    runMaterials.entryTime = runMaterials.entryTime.toISOString();
    runNoMaterials.entryTime = runNoMaterials.entryTime.toISOString();

    expect(model.getAll()).toEqual(expectedRuns);
  });
});

describe("clear", () => {
  test("removes state", () => {
    const run = new Run("uuid1", "name1", "location1", "5s", 5, 15, new Date());
    var val = JSON.stringify({ foo: [run] });
    localStorage.setItem(key, val);

    const model = new JobModel();
    model.load("foo");

    model.clear();

    expect(model.user).toBe(null);
    expect(model.jobs).toEqual(null);
  });
});

describe("add", () => {
  test("stores run", () => {
    var newRun = new Run(
      "nextRun",
      "name",
      "location",
      "1m",
      60,
      100,
      new Date()
    );

    const model = new JobModel();
    model.load("bar");
    model.add(newRun);

    // JSON.stringify will turn our dates into ISO strings
    newRun.entryTime = newRun.entryTime.toISOString();

    expect(model.getAll()).toEqual([newRun]);

    // also should be in local storage
    var rawData = localStorage.getItem(key);
    var allData = JSON.parse(rawData);

    expect(allData).toEqual({ bar: [newRun] });
  });
});

describe("delete", () => {
  test("non existent id, does nothing", () => {
    var run1 = new Run("id1", "name", "location", "1m", 60, 100, new Date());

    var val = JSON.stringify({ baz: [run1] });
    localStorage.setItem(key, val);

    const model = new JobModel();
    model.load("baz");

    model.delete("id2");

    // JSON.stringify will turn our dates into ISO strings
    run1.entryTime = run1.entryTime.toISOString();

    expect(model.getAll()).toEqual([run1]);
  });

  test("deletes correct item", () => {
    var run1 = new Run("id1", "name", "location", "1m", 60, 100, new Date());
    var run2 = new Run("id2", "name", "location", "1m", 60, 200, new Date());
    var run3 = new Run("id3", "name", "location", "1m", 60, 300, new Date());

    var val = JSON.stringify({ baz: [run1, run2, run3] });
    localStorage.setItem(key, val);

    const model = new JobModel();
    model.load("baz");
    model.delete("id2");

    // JSON.stringify will turn our dates into ISO strings
    run1.entryTime = run1.entryTime.toISOString();
    run3.entryTime = run3.entryTime.toISOString();

    expect(model.getAll()).toEqual([run1, run3]);
  });
});

describe("deleteAll", () => {
  test("clears data", () => {
    var run1 = new Run("id1", "name", "location", "1m", 60, 100, new Date());
    var run2 = new Run("id2", "name", "location", "1m", 60, 200, new Date());
    var run3 = new Run("id3", "name", "location", "1m", 60, 300, new Date());

    var val = JSON.stringify({ user1: [run1, run2, run3] });
    localStorage.setItem(key, val);

    const model = new JobModel();
    model.load("user1");

    model.deleteAll();

    expect(model.jobs).toEqual([]);

    // also should remove from storage
    var rawData = localStorage.getItem(key);
    var allData = JSON.parse(rawData);

    expect(allData).not.toHaveProperty("user1");
  });
});

describe("deleteAllForUser", () => {
  test("only clears user", () => {
    var run1 = new Run("id1", "name", "location", "1m", 60, 100, new Date());
    var run2 = new Run("id2", "name", "location", "1m", 60, 200, new Date());
    var run3 = new Run("id3", "name", "location", "1m", 60, 300, new Date());

    var val = JSON.stringify({ user1: [run1, run3], user2: [run2] });
    localStorage.setItem(key, val);

    const model = new JobModel();

    model.deleteAllForUser("user1");

    // should remove from storage
    var rawData = localStorage.getItem(key);
    var allData = JSON.parse(rawData);

    expect(allData).not.toHaveProperty("user1");
    expect(allData).toHaveProperty("user2");
  });
});
