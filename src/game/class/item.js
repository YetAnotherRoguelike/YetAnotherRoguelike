import { fromJSON, toJSON, serializable } from "@kxirk/serialize";

import Entity from "./entity.js";
import Equip from "./equip.js";
import Size from "./size.js";


/**
 * @abstract
 * @extends Entity
 */
const Item = class extends Entity {
  // #region Instance
  /** @type {keyof Equip} */ #equip;
  /** @type {keyof Size} */ #equipSize;


  constructor () {
    super();
    this.display.push("item");

    this.#equip = Equip.light;
    this.#equipSize = Size.medium;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {keyof Equip} */
  get equip () { return this.#equip; }
  set equip (equip) { this.#equip = equip; }

  /** @type {keyof Size} */
  get equipSize () { return this.#equipSize; }
  set equipSize (size) { this.#equipSize = size; }
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

    this.equip = fromJSON(json, this, "equip", reviver?.equip);
    this.equipSize = fromJSON(json, this, "equipSize", reviver?.equipSize);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);
    json.constructor = toJSON(this, "constructor", replacer?.constructor);

    json.equip = toJSON(this, "equip", replacer?.equip);
    json.equipSize = toJSON(this, "equipSize", replacer?.equipSize);

    return json;
  }
  // #endregion
};
export default serializable(Item, true);
