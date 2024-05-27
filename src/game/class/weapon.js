import Equip from "./equip.js";
import Gear from "./gear.js";


const Weapon = class extends Gear {
  constructor () {
    super();
    this.display.push("weapon");
  }
};
export default Weapon;

export const Light = class extends Weapon {
  constructor () {
    super();
    this.display.push("light");

    this.equip = Equip.weaponLight;
  }
};
Weapon.Light = Light;

export const Medium = class extends Weapon {
  constructor () {
    super();
    this.display.push("medium");

    this.equip = Equip.weaponMedium;
  }
};
Weapon.Medium = Medium;

export const Heavy = class extends Weapon {
  constructor () {
    super();
    this.display.push("heavy");

    this.equip = Equip.weaponHeavy;
  }
};
Weapon.Heavy = Heavy;

export const Ranged = class extends Weapon {
  constructor () {
    super();
    this.display.push("ranged");

    this.equip = Equip.weaponRanged;
  }
};
Weapon.Ranged = Ranged;
