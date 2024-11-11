import Equip from "./equip.js";
import Gear from "./gear.js";


/** @abstract */
const Shield = class extends Gear {
  constructor () {
    super();
    this.display.push("shield");
  }
};
export default Shield;

/** @abstract */
export const Light = class extends Shield {
  constructor () {
    super();
    this.display.push("light");

    this.equip = Equip.shieldLight;
  }
};
Shield.Light = Light;

/** @abstract */
export const Medium = class extends Shield {
  constructor () {
    super();
    this.display.push("medium");

    this.equip = Equip.shieldMedium;
  }
};
Shield.Medium = Medium;

/** @abstract */
export const Heavy = class extends Shield {
  constructor () {
    super();
    this.display.push("heavy");

    this.equip = Equip.shieldHeavy;
  }
};
Shield.Heavy = Heavy;
