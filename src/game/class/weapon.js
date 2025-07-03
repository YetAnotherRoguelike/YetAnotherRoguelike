import { fromJSON, toJSON } from "@kxirk/serialize";

import Attack from "./attack.js";
import Gear from "./gear.js";


/**
 * @abstract
 * @extends Gear
 */
const Weapon = class extends Gear {
  // #region Instance
  /** @type {Attack[]} */ #attacks;


  constructor () {
    super();
    this.display.push("weapon");

    this.#attacks = [];
  }
  // #endregion

  // #region Instance Accessors
  /** @type {Attack[]} */
  get attacks () { return this.#attacks; }
  // #endregion


  // #region Serialize
  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
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
  // #endregion
};
export default Weapon;
