import Equip from "./equip.js";
import Gear from "./gear.js";


/**
 * @abstract
 * @extends Gear
 */
const Armor = class extends Gear {
  // #region Instance
  constructor () {
    super();
    this.display.push("armor");

    this.equip = Equip.armor;
  }
  // #endregion
};
export default Armor;
