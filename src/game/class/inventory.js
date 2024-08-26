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

  /**
   * @param {Object} json
   * @returns {Inventory}
   */
  static fromJSON (json) {
    return new Inventory().fromJSON(json);
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
    const items = [];
    for (const slot of this.#slots) items.push(...slot);

    return items[Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @returns {Inventory}
   */
  fromJSON (json) {
    for (const slot of json.slots) this.#slots.fromJSON(slot);
    this.Type = (json.Type === "Item" ? Item : Item[json.Type]);
    this.size = json.size;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      slots: this.#slots.map((slot) => slot.toJSON()),
      Type: this.Type.prototype.constructor.name,
      size: this.size
    };
  }
};
export default Inventory;
