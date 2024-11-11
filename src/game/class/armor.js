import Equip from "./equip.js";
import Gear from "./gear.js";
import Item from "./item.js";


/** @abstract */
const Armor = class extends Gear {
  constructor () {
    super();
    this.display.push("armor");
  }
};
Item.Armor = Armor;
export default Armor;

/** @abstract */
export const Light = class extends Armor {
  constructor () {
    super();
    this.display.push("light");

    this.equip = Equip.armorLight;
  }
};
Armor.Light = Light;

/** @abstract */
export const Medium = class extends Armor {
  constructor () {
    super();
    this.display.push("medium");

    this.equip = Equip.armorMedium;
  }
};
Armor.Medium = Light;

/** @abstract */
export const Heavy = class extends Armor {
  constructor () {
    super();
    this.display.push("heavy");

    this.equip = Equip.armorHeavy;
  }
};
Armor.Heavy = Light;
