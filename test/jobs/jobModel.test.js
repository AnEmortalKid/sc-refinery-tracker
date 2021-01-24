import JobModel from "../../src/jobs/jobModel";
import Run from "../../src/run";

const key = "mining_tracker.runs";

// {"local":[{"uuid":"68e64d5a-99e6-47c9-8df3-8fad78edee8f","name":"","location":"HUR-L1","duration":"0s","durationSeconds":0,"yieldAmount":"1515","entryTime":"2021-01-22T05:40:02.354Z"}]}

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
