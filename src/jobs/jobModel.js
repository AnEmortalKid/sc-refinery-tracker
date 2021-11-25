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

  /**
   * Loads data for the given user
   * @param {User} user the name of the user, cannot be null
   */
  load(user) {
    this.user = user;
    this.jobs = this._loadData(user);
    this._notifyJobsChanged();
  }

  /**
   * Clears the currently loaded data, load should be called prior to re-interacting with this model
   */
  clear() {
    this.user = null;
    this.jobs = null;
    this._notifyJobsChanged();
  }

  add(job) {
    this.jobs.push(job);
    this._commit(this.user, this.jobs);
  }

  get(jobId) {
    var found = this.jobs.find((job) => job.uuid == jobId);
    if (!found) {
      return null;
    }

    return found;
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

  deleteAllForUser(user) {
    // TODO if this.user === user?
    this._deleteData(user);
  }

  update(updatedJob) {
    var exisstingIndex = this.jobs.findIndex(
      (job) => job.uuid == updatedJob.uuid
    );
    this.jobs[exisstingIndex] = updatedJob;
    this._commit(this.user, this.jobs);
  }

  registerOnJobChangeListener(callback) {
    this.onJobChangeListeners.push(callback);
  }
}
