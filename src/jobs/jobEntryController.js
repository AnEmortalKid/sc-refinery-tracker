import { getMaterialsList } from "../model/materials";

/**
 * Component that manages the entry and update of a Refinery Job
 */
export default class JobEntryController {
  constructor(jobEntryView) {
    this.jobEntryView = jobEntryView;
  }

  /**
   * Toggles between allowing a user to enter a single yield amount or a set of materials that compose the total yield
   */
  toggleMaterialEntryMode() {
    this.jobEntryView.toggleMaterialEntryMode(event.target.checked);
  }

  addMaterialEntry() {
    this.jobEntryView.addMaterialOption();
  }
}
