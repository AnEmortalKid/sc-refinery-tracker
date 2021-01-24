const dataKey = "mining_tracker.runs";

/**
 * Model for Refinery Jobs
 */
export default class JobModel {
  constructor() {
    this.user = null;
    this.jobs = [];
  }

  _commit(user, runs) {
    var jsonData = localStorage.getItem(dataKey);

    var allData = JSON.parse(localStorage.getItem(dataKey)) || {};

    allData[user] = runs;
    localStorage.setItem(dataKey, JSON.stringify(allData));
  }

  _deleteData(user) {
    var allData = JSON.parse(localStorage.getItem(dataKey)) || {};

    delete allData[user];
    localStorage.setItem(dataKey, JSON.stringify(allData));
  }

  _loadData(user) {
    var allData = JSON.parse(localStorage.getItem(dataKey)) || {};
    return allData[user] || [];
  }

  load(user) {
    this.user = user;
    this.jobs = this._loadData(user);
  }

  clear() {
    this.user = null;
    this.jobs = [];
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
    this.runs = [];
    this._deleteData(this.user);
  }

  // TODO edit(job)
}
