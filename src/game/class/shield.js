import Equip from "./equip.js";
import Gear from "./gear.js";


/**
 * @abstract
 * @extends Gear
 */
const Shield = class extends Gear {
  // #region Instance
  constructor () {
    super();
    this.display.push("shield");

    this.equip = Equip.light;
  }
  // #endregion
};
export default Shield;
