
import { SortModes, SortDirection, SortFields } from "./sortOptions";


/**
 * Controls sorting on the job view
 */
export default class SortController {

  // TODO save settings
  constructor() {
    this.sortMode = SortModes.SINGLE;
    this.sorters = [];
  }


  getSorted(jobs) {
    if (this.sorters.length < 1) {
      return jobs;
    }

    if (this.sortMode = SortModes.SINGLE) {
      return this._sortSingle(jobs);
    }

    // TODO multiple
  }

  clearSorts() {
    this.sorters = [];
  }

  setSortMode(sortMode) {

  }

  setSorting(sortField, direction) {

    // TODO check if sorter for that field exists

    this.sorters.push({ field: sortField, direction: direction });
  }

  removeSorting(sortField) {
    // TODO remove field
  }

  _sortSingle(jobs) {
    const sortOption = this.sorters[0];


    var sortedJobs = [...jobs];

    const sortFunc = this._getSortFunction(sortOption.field, sortOption.direction);

    return sortedJobs.sort(sortFunc);
  }


  _getSortFunction(sortField, direction) {
    if (sortField == SortFields.LOCATION) {
      return (left, right) => direction * this._sortLocation(left, right);
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

}