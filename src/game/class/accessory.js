import Equip from "./equip.js";
import Gear from "./gear.js";
import Item from "./item.js";


/** @abstract */
const Accessory = class extends Gear {
  constructor () {
    super();
    this.display.push("accessory");

    this.equip = Equip.accessory;
  }
};
Item.Accessory = Accessory;
export default Accessory;
