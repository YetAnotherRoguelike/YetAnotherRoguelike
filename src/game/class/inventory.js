import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/array.js";

import Item from "./item.js";
import Slot from "./slot.js";


const Inventory = class {
  /** @type {Class<Item>} */
  #Type;
  /** @type {Slot[]} */
  #slots;

  /**
   * @argument {Class<Item>} [Type]
   * @argument {number} [size]
   */
  constructor (Type = Item, size = 1) {
    this.#slots = [];
    this.Type = Type;
    this.size = size;
  }


  /** @type {Class<Item>} */
  get Type () { return this.#Type; }
  set Type (Type) { this.#Type = Type; }


  /** @type {number} */
  get size () { return this.#slots.length; }
  set size (size) {
    const prev = (this.size ?? 0);

    for (let i = prev; i < size.clamp(0); i++) this.#slots[i] ??= new Slot(this.Type);
  }

  /**
   * @argument {Item} item
   * @returns {boolean}
   */
  add (item) {
    for (const slot of this.#slots) {
      if (slot.add(item)) return true;
    }

    return false;
  }

  /**
   * @argument {number} index
   * @returns {Item}
   */
  remove (index) {
    const item = this.#slots[index].remove();

    return item;
  }


  /** @type {Iterator<Item>} */
  [Symbol.iterator] () {
    return this.#slots[Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Inventory}
   */
  fromJSON (json, reviver) {
    this.Type = fromJSON(json, this, "Type", (reviver?.Type ?? ((constructor) => Item[constructor])));
    fromJSON(json, this, "slots", (reviver?.slots ?? { value: Slot.prototype.fromJSON }));

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.Type = toJSON(this, "Type", replacer?.Type);
    json.slots = toJSON([...this], undefined, replacer?.slots);

    return json;
  }
};
export default Inventory;
