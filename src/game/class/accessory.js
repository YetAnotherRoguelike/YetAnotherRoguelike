import Equip from "./equip.js";
import Gear from "./gear.js";


/**
 * @abstract
 * @extends Gear
 */
const Accessory = class extends Gear {
  // #region Instance
  constructor () {
    super();
    this.display.push("accessory");

    this.equip = Equip.accessory;
  }
  // #endregion
};
export default Accessory;
