import { SortModes, SortDirection, SortFields } from "./sortOptions";

/**
 * Controls sorting on the job view
 */
export default class SortController {
  // TODO save settings
  constructor() {
    this.sortMode = SortModes.SINGLE;
    this.sorters = [];

    this.singleSort = null;
  }

  getSorted(jobs) {
    if (!this.singleSort) {
      return jobs;
    }

    // TODO support multiple
    return this._sortSingle(jobs);
  }

  clearSorts() {
    this.singleSort = null;
  }

  setSorting(sortField, direction) {
    this.singleSort = { field: sortField, direction: direction };
  }

  getCurrentSort() {
    return this.singleSort;
  }

  _sortSingle(jobs) {
    const sortedJobs = [...jobs];
    const sortOption = this.singleSort;
    const sortFunc = this._getSortFunction(
      sortOption.field,
      sortOption.direction
    );
    return sortedJobs.sort(sortFunc);
  }

  _getSortFunction(sortField, direction) {
    if (sortField == SortFields.LOCATION) {
      return (left, right) => direction * this._sortLocation(left, right);
    }

    if (sortField == SortFields.DURATION) {
      return (left, right) => direction * this._sortDuration(left, right);
    }

    if (sortField == SortFields.TIME_REMAINING) {
      return (left, right) => direction * this._sortTimeRemaining(left, right);
    }

    if (sortField == SortFields.YIELD) {
      return (left, right) => direction * this._sortYield(left, right);
    }

    if (sortField == SortFields.STATUS) {
      return (left, right) => direction * this._sortStatus(left, right);
    }
  }

  _sortLocation(left, right) {
    const lVal = left.location.toUpperCase();
    const rVal = right.location.toUpperCase();

    if (lVal < rVal) {
      return -1;
    }
    if (lVal > rVal) {
      return 1;
    }
    return 0;
  }

  _sortDuration(left, right) {
    var leftDuration = left.durationSeconds;
    var rightDuration = right.durationSeconds;

    if (leftDuration < rightDuration) {
      return -1;
    }
    if (leftDuration > rightDuration) {
      return 1;
    }

    return 0;
  }

  _sortTimeRemaining(left, right) {
    var nowSeconds = Math.round(new Date().getTime() / 1000);

    var leftRemaining = this._getTimeRemaining(nowSeconds, left);
    var rightRemaining = this._getTimeRemaining(nowSeconds, right);

    if (leftRemaining < rightRemaining) {
      return -1;
    }
    if (leftRemaining > rightRemaining) {
      return 1;
    }
    return 0;
  }

  _sortYield(left, right) {
    var leftYield = left.yieldAmount;
    var rigthYield = right.yieldAmount;

    if (leftYield < rigthYield) {
      return -1;
    }
    if (leftYield > rigthYield) {
      return 1;
    }
    return 0;
  }

  _sortStatus(left, right) {
    var nowSeconds = Math.round(new Date().getTime() / 1000);

    var leftRemaining = this._getTimeRemaining(nowSeconds, left);
    var leftStatus = this._getStatus(leftRemaining).toUpperCase();
    var rightRemaining = this._getTimeRemaining(nowSeconds, right);
    var rightStatus = this._getStatus(rightRemaining).toUpperCase();

    if (leftStatus < rightStatus) {
      return -1;
    }
    if (leftStatus > rightStatus) {
      return 1;
    }
    return 0;
  }

  _getTimeRemaining(nowSeconds, job) {
    var entrySeconds = Math.round(new Date(job.entryTime).getTime() / 1000);
    var ellapsedSeconds = nowSeconds - entrySeconds;
    return job.durationSeconds - ellapsedSeconds;
  }

  _getStatus(timeRemaining) {
    if (timeRemaining > 0) {
      return "In Progress";
    } else {
      return "Done";
    }
  }
}
