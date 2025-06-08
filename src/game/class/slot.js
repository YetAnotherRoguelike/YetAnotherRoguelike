import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/array.js";

import Item from "./item.js";


const Slot = class {
  /** @type {Class<Item>} */
  #TypeInitial;
  /** @type {Class<Item>} */
  #Type;

  /** @type {Item[]} */
  #items;
  /** @type {boolean} */
  #open;

  /**
   * @argument {Class<Item>} [Type]
   */
  constructor (Type = Item) {
    this.#TypeInitial = Type;
    this.#Type = Type;

    this.#items = [];
    this.#open = true;
  }


  /** @type {Class<Item>} */
  get TypeInitial () { return this.#TypeInitial; }
  set TypeInitial (Type) { this.#TypeInitial = Type; }

  /** @type {Class<Item>} */
  get Type () { return this.#Type; }
  set Type (Type) { this.#Type = Type; }


  /** @type {number} */
  get count () { return this.#items.length; }

  /** @type {number} */
  get weight () { return (this.count * (this.#items[0]?.weight ?? 0)); }

  /** @type {boolean} */
  get open () { return this.#open; }
  set open (open) { this.#open = open; }


  /**
   * @argument {Item} item
   * @returns {boolean}
   */
  add (item) {
    if (this.open && (item instanceof this.Type) && (this.count < item.stack)) {
      this.#items.push(item);
      this.Type = item.constructor;

      return true;
    }

    return false;
  }

  /**
   * @returns {Item}
   */
  remove () {
    const item = this.#items.pop();
    if (this.count === 0) {
      this.Type = this.TypeInitial;
    }

    return item;
  }


  /** @type {Iterator<Item>} */
  [Symbol.iterator] () {
    return this.#items[Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Slot}
   */
  fromJSON (json, reviver) {
    this.TypeInitial = fromJSON(json, this, "TypeInitial", (reviver?.TypeInitial ?? ((constructor) => Item[constructor])));
    this.Type = fromJSON(json, this, "Type", (reviver?.Type ?? ((constructor) => Item[constructor])));

    fromJSON(json, this, "items", (reviver?.items ?? { value: Item.fromJSON }));
    this.open = fromJSON(json, this, "open", reviver?.open);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.TypeInitial = toJSON(this, "TypeInitial", replacer?.TypeInitial);
    json.Type = toJSON(this, "Type", replacer?.Type);

    json.items = toJSON([...this], undefined, replacer?.items);
    json.open = toJSON(this, "open", replacer?.open);

    return json;
  }
};
export default Slot;
