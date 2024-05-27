import Equip from "./equip.js";
import Gear from "./gear.js";


const Accessory = class extends Gear {
  constructor () {
    super();
    this.display.push("accessory");

    this.equip = Equip.accessory;
  }
};
export default Accessory;
