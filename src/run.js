export default class Run {
  constructor(
    uuid,
    name,
    location,
    duration,
    durationSeconds,
    yieldAmount,
    entryTime
  ) {
    this.uuid = uuid;
    this.name = name;
    this.location = location;
    this.duration = duration;
    this.durationSeconds = durationSeconds;
    this.yieldAmount = yieldAmount;
    this.entryTime = entryTime;
  }
}
