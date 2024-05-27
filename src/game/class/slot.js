import "@kxirk/utils/array.js";

import Item from "./item.js";


const Slot = class {
  /** @type {Class.<Item>} */
  #TypeInitial;
  /** @type {Class.<Item>} */
  #Type;

  /** @type {Item[]} */
  #items;
  /** @type {boolean} */
  #open;

  /**
   * @argument {Class.<Item>} [Type]
   */
  constructor (Type = Item) {
    this.TypeInitial = Type;
    this.Type = Type;

    this.#items = [];
    this.open = true;
  }

  /**
   * @param {Object} json
   * @returns {Slot}
   */
  static fromJSON (json) {
    return new Slot().fromJSON(json);
  }


  /** @type {Class.<Item>} */
  get TypeInitial () { return this.#TypeInitial; }
  set TypeInitial (Type) { this.#TypeInitial = Type; }

  /** @type {Class.<Item>} */
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


  /** @type {Function} */
  [Symbol.iterator] () {
    return this.#items[Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @returns {Slot}
   */
  fromJSON (json) {
    this.TypeInitial = (json.TypeInitial === "Item" ? Item : Item[json.TypeInitial]);
    this.Type = (json.Type === "Item" ? Item : Item[json.Type]);

    for (const item of json.items) this.#items.push( Item.fromJSON(item) );
    this.open = json.open;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      TypeInitial: this.TypeInitial.prototype.constructor.name,
      Type: this.Type.prototype.constructor.name,

      items: [...this.#items].map((item) => item.toJSON()),
      open: this.open
    };
  }
};
export default Slot;
