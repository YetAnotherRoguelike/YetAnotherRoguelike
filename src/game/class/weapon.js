import { fromJSON, toJSON } from "@kxirk/serialize";

import Attack from "./attack.js";
import Equip from "./equip.js";
import Gear from "./gear.js";


/** @abstract */
const Weapon = class extends Gear {
  /** @type {Attack[]} */
  #attacks;

  constructor () {
    super();
    this.display.push("weapon");

    this.#attacks = [];
  }


  /** @type {Attack[]} */
  get attacks () { return this.#attacks; }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Weapon}
   */
  fromJSON (json, reviver) {
    super.fromJSON(json, reviver);

    fromJSON(json, this, "attacks", (reviver?.attacks ?? { value: Attack.fromJSON }));

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    json.attacks = toJSON(this, "attacks", replacer?.attacks);

    return json;
  }
};
export default Weapon;

/** @abstract */
export const Light = class extends Weapon {
  constructor () {
    super();
    this.display.push("light");

    this.equip = Equip.light;
  }
};
Weapon.Light = Light;

/** @abstract */
export const Medium = class extends Weapon {
  constructor () {
    super();
    this.display.push("medium");

    this.equip = Equip.medium;
  }
};
Weapon.Medium = Medium;

/** @abstract */
export const Versatile = class extends Weapon {
  constructor () {
    super();
    this.display.push("versatile");

    this.equip = Equip.versatile;
  }
};
Weapon.Versatile = Versatile;

/** @abstract */
export const Heavy = class extends Weapon {
  constructor () {
    super();
    this.display.push("heavy");

    this.equip = Equip.heavy;
  }
};
Weapon.Heavy = Heavy;

/** @abstract */
export const Ranged = class extends Weapon {
  constructor () {
    super();
    this.display.push("ranged");

    this.equip = Equip.light;
  }
};
Weapon.Ranged = Ranged;
