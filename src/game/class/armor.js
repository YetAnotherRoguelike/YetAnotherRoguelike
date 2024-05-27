import Equip from "./equip.js";
import Gear from "./gear.js";


const Armor = class extends Gear {
  constructor () {
    super();
    this.display.push("armor");
  }
};
export default Armor;

export const Light = class extends Armor {
  constructor () {
    super();
    this.display.push("light");

    this.equip = Equip.armorLight;
  }
};
Armor.Light = Light;

export const Medium = class extends Armor {
  constructor () {
    super();
    this.display.push("medium");

    this.equip = Equip.armorMedium;
  }
};
Armor.Medium = Light;

export const Heavy = class extends Armor {
  constructor () {
    super();
    this.display.push("heavy");

    this.equip = Equip.armorHeavy;
  }
};
Armor.Heavy = Light;
