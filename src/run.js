export default class Run {
  /**
   * @param {String} uuid an identifier
   * @param {String} name a potentially null name
   * @param {String} location name of the location
   * @param {String} duration a duration representation e.g 1d 1m
   * @param {int} durationSeconds amount of seconds
   * @param {int} yieldAmount amount of all materials combined
   * @param {date} entryTime time when this Run should be recorded
   * @param {object} materials a dictionary of materials to units
   */
  constructor(
    uuid,
    name,
    location,
    duration,
    durationSeconds,
    yieldAmount,
    entryTime,
    materials = {}
  ) {
    this.uuid = uuid;
    this.name = name;
    this.location = location;
    this.duration = duration;
    this.durationSeconds = durationSeconds;
    this.yieldAmount = yieldAmount;
    this.entryTime = entryTime;
    this.materials = materials;
  }
}
