export default class RunEntry {
  constructor(name, location, duration, yieldAmount, materials = {}) {
    this.name = name;
    this.location = location;
    this.duration = duration;
    this.yieldAmount = yieldAmount;
    this.materials = materials;
  }
}
