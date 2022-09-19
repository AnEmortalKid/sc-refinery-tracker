export const SortModes = {
  SINGLE: 1,
  MUTLIPLE: 2,
};

export const SortDirection = {
  ASC: 1,
  DESC: -1,
  NONE: 0,
};

export const SortFields = {
  LOCATION: "location",
  DURATION: "duration",
  TIME_REMAINING: "timeRemaining",
  STATUS: "status",
  YIELD: "yield",
};

export function getNextDirection(sortDirection) {
  if (sortDirection == SortDirection.ASC) {
    return SortDirection.DESC;
  }
  if (sortDirection == SortDirection.DESC) {
    return SortDirection.NONE;
  }
  return SortDirection.ASC;
}

export function getSortField(field) {
  if (field === SortFields.LOCATION) {
    return SortFields.LOCATION;
  }
  if (field === SortFields.DURATION) {
    return SortFields.DURATION;
  }
  if (field === SortFields.TIME_REMAINING) {
    return SortFields.TIME_REMAINING;
  }
  if (field === SortFields.STATUS) {
    return SortFields.STATUS;
  }
  if (field === SortFields.YIELD) {
    return SortFields.YIELD;
  }

  return null;
}
