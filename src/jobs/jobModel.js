const dataKey = "mining_tracker.runs";

/**
 * Model for Refinery Jobs
 */
export default class JobModel {
  constructor() {
    this.user = null;
    this.jobs = [];
    this.onJobChangeListeners = [];
  }

  _notifyJobsChanged() {
    this.onJobChangeListeners.forEach((listener) => {
      listener(this.jobs);
    });
  }

  _commit(user, runs) {
    var allData = JSON.parse(localStorage.getItem(dataKey)) || {};

    allData[user] = runs;
    localStorage.setItem(dataKey, JSON.stringify(allData));
    this._notifyJobsChanged();
  }

  _deleteData(user) {
    var allData = JSON.parse(localStorage.getItem(dataKey)) || {};

    delete allData[user];
    localStorage.setItem(dataKey, JSON.stringify(allData));
    this._notifyJobsChanged();
  }

  _loadData(user) {
    var allData = JSON.parse(localStorage.getItem(dataKey)) || {};
    return allData[user] || [];
  }

  load(user) {
    this.user = user;
    this.jobs = this._loadData(user);
    this._notifyJobsChanged();
  }

  // TODO this might not actually be needed
  clear() {
    this.user = null;
    this.jobs = [];
    this._notifyJobsChanged();
  }

  add(job) {
    this.jobs.push(job);
    this._commit(this.user, this.jobs);
  }

  getAll() {
    return this.jobs;
  }

  delete(jobId) {
    this.jobs = this.jobs.filter((job) => job.uuid !== jobId);
    this._commit(this.user, this.jobs);
  }

  deleteAll() {
    this.jobs = [];
    this._deleteData(this.user);
  }

  // TODO edit(job)

  registerOnJobChangeListener(callback) {
    this.onJobChangeListeners.push(callback);
  }
}
