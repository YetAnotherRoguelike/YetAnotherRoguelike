import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Entity from "./entity.js";
import Equip from "./equip.js";


/** @abstract */
const Item = class extends Entity {
  /** @type {Equip} */
  #equip;
  /** @type {number} */
  #stack;

  constructor () {
    super();
    this.display.push("item");

    this.equip = Equip.item;
    this.stack = 1;
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


  /** @type {Equip} */
  get equip () { return this.#equip; }
  set equip (equip) { this.#equip = equip; }

  /** @type {number} */
  get stack () { return this.#stack; }
  set stack (size) {
    this.#stack = size.clamp(1);
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Item}
   */
  fromJSON (json, reviver) {
    super.fromJSON(json, reviver);

    this.equip = fromJSON(json, this, "equip", reviver?.equip);
    this.stack = fromJSON(json, this, "stack", reviver?.stack);

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
    json.stack = toJSON(this, "stack", replacer?.stack);

    return json;
  }
};
export default Item;
