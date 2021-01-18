/**
 * Component responsible for fetching and storing runs
 */
import Run from "./run";
import { v4 as uuidv4 } from "uuid";
import { toSeconds } from "./durationParser";

const runsKey = "mining_tracker.runs";

function toRun(runEntry) {
  var entryTime = new Date();
  var uuid = uuidv4();

  var durationSeconds = toSeconds(runEntry.duration);

  var run = new Run(
    uuid,
    runEntry.name,
    runEntry.location,
    runEntry.duration,
    durationSeconds,
    runEntry.yieldAmount,
    entryTime
  );

  return run;
}

function storeRuns(userName, runData) {
  var rawRunData = localStorage.getItem(runsKey);
  var allRuns = {};
  if (rawRunData) {
    allRuns = JSON.parse(rawRunData);
  }

  allRuns[userName] = runData;
  localStorage.setItem(runsKey, JSON.stringify(allRuns));
}

function removeRunData(userName) {
  var rawRunData = localStorage.getItem(runsKey);
  var allRuns = {};
  if (rawRunData) {
    allRuns = JSON.parse(rawRunData);
  }

  delete allRuns[userName];
  localStorage.setItem(runsKey, JSON.stringify(allRuns));
}

export default class RunController {
  constructor(userController) {
    this.runs = [];
    this.userController = userController;
  }

  loadRuns() {
    var current = this.userController.getCurrentUser();

    if (!current) {
      this.runs = [];
      return;
    }

    var raw = localStorage.getItem(runsKey);
    if (!raw) {
      this.runs = [];
      return;
    }

    var allRuns = JSON.parse(raw);
    if (!allRuns[current]) {
      this.runs = [];
    } else {
      this.runs = allRuns[current];
    }
  }

  store(runEntry) {
    this.runs.push(toRun(runEntry));
    this.save();
  }

  fetch() {
    return this.runs;
  }

  remove(runId) {
    const found = this.runs.find((run) => run.uuid == runId);
    if (found) {
      const foundIndex = this.runs.indexOf(found);
      this.runs.splice(foundIndex, 1);
    }
    this.save();
  }

  removeAllRuns(userName) {
    this.runs = [];
    removeRunData(userName);
  }

  save() {
    var current = this.userController.getCurrentUser();
    if (current) {
      storeRuns(current, this.runs);
    }
  }
}
