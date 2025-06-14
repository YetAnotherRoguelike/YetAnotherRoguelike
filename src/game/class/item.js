import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Entity from "./entity.js";
import Equip from "./equip.js";
import Size from "./size.js";


/** @abstract */
const Item = class extends Entity {
  /** @type {keyof Equip} */
  #equip;
  /** @type {keyof Size} */
  #equipSize;

  constructor () {
    super();
    this.display.push("item");

    this.#equip = Equip.light;
    this.#equipSize = Size.medium;
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Item}
   */
  static fromJSON (json, reviver) {
    return new Item[json.constructor]().fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
  }


  /** @type {keyof Equip} */
  get equip () { return this.#equip; }
  set equip (equip) { this.#equip = equip; }

  /** @type {keyof Size} */
  get equipSize () { return this.#equipSize; }
  set equipSize (size) { this.#equipSize = size; }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Item}
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

    json.equip = toJSON(this, "equip", replacer?.equip);
    json.equipSize = toJSON(this, "equipSize", replacer?.equipSize);

    return json;
  }
};
export default Item;
