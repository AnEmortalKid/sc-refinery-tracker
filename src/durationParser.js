const secondsInDay = 24 * 60 * 60;
const secondsInHour = 60 * 60;
const secondsInMinute = 60;

function partToSeconds(part) {
  if (part.includes("d")) {
    var numb = part.replace("d", "");
    var days = parseInt(numb);
    return secondsInDay * days;
  }

  if (part.includes("h")) {
    var numb = part.replace("h", "");
    var hours = parseInt(numb);
    return secondsInHour * hours;
  }

  if (part.includes("m")) {
    var numb = part.replace("m", "");
    var minutes = parseInt(numb);
    return secondsInMinute * minutes;
  }

  // hope it is a seconds string
  var numb = part.replace("s", "");
  return parseInt(numb);
}

export function toDurationString(seconds) {
  if (seconds < 0) {
    return "";
  }

  var remaining = seconds;

  var days = Math.floor(remaining / secondsInDay);
  remaining -= days * secondsInDay;

  var hours = Math.floor(remaining / secondsInHour);
  remaining -= hours * secondsInHour;

  var minutes = Math.floor(remaining / secondsInMinute);
  remaining -= minutes * secondsInMinute;

  var parts = "";
  if (days > 0) {
    parts += days + "d ";
  }

  if (hours > 0) {
    parts += hours + "h ";
  }

  if (minutes > 0) {
    parts += minutes + "m ";
  }

  if (remaining > 0) {
    parts += remaining + "s ";
  }

  return parts.trim();
}

export function toSeconds(durationString) {
  var parts = durationString.split(" ");
  var totalSecs = 0;
  parts.forEach((part) => (totalSecs += partToSeconds(part)));
  return totalSecs;
}

/**
 * Returns a dictionary of the duration parts (days/hours/minutes/seconds)
 * @param {int} durationSeconds
 */
export function toTimeFragments(durationSeconds) {
  var fragment = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  var remaining = durationSeconds;

  if (remaining >= secondsInDay) {
    var fullDays = Math.floor(remaining / secondsInDay);
    remaining -= fullDays * secondsInDay;
    fragment.days = fullDays;
  }

  if (remaining >= secondsInHour) {
    var fullHours = Math.floor(remaining / secondsInHour);
    remaining -= fullHours * secondsInHour;
    fragment.hours = fullHours;
  }

  if (remaining >= secondsInMinute) {
    var fullMinutes = Math.floor(remaining / secondsInMinute);
    remaining -= fullMinutes * secondsInMinute;
    fragment.minutes = fullMinutes;
  }

  fragment.seconds = remaining;

  return fragment;
}
