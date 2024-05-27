import "@kxirk/utils/array.js";

import Item from "./item.js";
import Slot from "./slot.js";


const Inventory = class {
  /** @type {Slot[]} */
  #contents;
  /** @type {Class.<Item>} */
  #Type;
  /** @type {number} */
  #size;

  /**
   * @argument {Class.<Item>} [Type]
   * @argument {number} [size]
   */
  constructor (Type = Item, size = 1) {
    this.#contents = [];
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


  /** @type {Class.<Item>} */
  get Type () { return this.#Type; }
  set Type (Type) { this.#Type = Type; }

  /** @type {number} */
  get size () { return this.#size; }
  set size (size) {
    const prev = (this.size ?? 0);
    this.#size = size.clamp(0);

    for (let i = prev; i < this.size; i++) this.#contents[i] ??= new Slot(this.Type);
  }


  /**
   * @argument {Item} item
   * @returns {boolean}
   */
  add (item) {
    for (const slot of this.#contents) {
      if (slot.add(item)) return true;
    }

    return false;
  }

  /**
   * @argument {number} index
   * @returns {Item}
   */
  remove (index) {
    const item = this.#contents[index].remove();

    return item;
  }

  /** @type {Function} */
  [Symbol.iterator] () {
    const items = [];
    for (const slot of this.#contents) items.push(...slot);

    return items[Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @returns {Inventory}
   */
  fromJSON (json) {
    for (const slot of json.contents) this.#contents.fromJSON(slot);
    this.Type = (json.Type === "Item" ? Item : Item[json.Type]);
    this.size = json.size;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      contents: this.#contents.map((slot) => slot.toJSON()),
      Type: this.Type.prototype.constructor.name,
      size: this.size
    };
  }
};
export default Inventory;
