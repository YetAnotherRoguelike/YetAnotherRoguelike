import { fromJSON, toJSON } from "@kxirk/serialize";
import Object from "@kxirk/utils/object.js";

import Item from "./item.js";


/** @enum {string} */
const Slot = class {
  /** @type {string} */
  static armor = "armor";

  /** @type {string} */
  static hand = "hand";
  /** @type {string} */
  static side = "side";
  /** @type {string} */
  static both = "both";

  /** @type {string} */
  static accessories = "accessories";

  /** @type {Item} */
  #item;
  /** @type {keyof Equip} */
  #equip;
  /** @type {keyof Slot} */
  #slot;

  /** @type {Class<Item>} */
  #Type;
  /** @type {number} */
  #dimensionMax;
  /** @type {number} */
  #volumeMax;
  /** @type {boolean} */
  #open;

  /**
   * @param {Class<Item>} [Type]
   * @param {number} [dimensionMax]
   * @param {number} [volumeMax]
   * @param {boolean} [open]
   */
  constructor (Type = Item, dimensionMax = Infinity, volumeMax = Infinity, open = true) {
    this.clear();

    this.Type = Type;
    this.dimensionMax = dimensionMax;
    this.volumeMax = volumeMax;
    this.open = open;

    Object.assignGettersAsEnumerable(this, Slot);
  }


  /** @type {Item} */
  get item () { return this.#item; }
  set item (item) { this.#item = item; }

  /** @type {boolean} */
  get empty () { return (this.#item === null); }

  /** @type {number} */
  get weight () { return (this.item?.weight ?? 0); }

  /** @type {keyof Equip} */
  get equip () { return this.#equip; }

  /** @type {keyof Slot} */
  get slot () { return this.#slot; }
  set slot (slot) { this.#slot = slot; }


  /** @type {Class<Item>} */
  get Type () { return this.#Type; }
  set Type (Type) { this.#Type = Type; }

  /** @type {number} */
  get dimensionMax () { return this.#dimensionMax; }
  set dimensionMax (dimensionMax) {
    this.#dimensionMax = dimensionMax.clamp(0);
  }

  /** @type {number} */
  get volumeMax () { return this.#volumeMax; }
  set volumeMax (volumeMax) {
    this.#volumeMax = volumeMax.clamp(0);
  }

  /** @type {boolean} */
  get open () { return this.#open; }
  set open (open) { this.#open = open; }


  /**
   * @param {Item} item
   * @param {keyof Equip} equip
   * @param {keyof Slot} slot
   * @returns {Slot}
   */
  set (item, equip, slot) {
    this.#item = item;
    this.#equip = equip;
    this.slot = slot;

    return this;
  }

  /**
   * @param {Item} item
   * @param {keyof Equip} equip
   * @param {keyof Slot} slot
   * @returns {boolean}
   */
  add (item, equip, slot) {
    if (!this.empty) return false;

    if (!(item instanceof this.Type)) return false;
    if (item.dimensionMax > this.dimensionMax) return false;
    if (item.volume > this.volumeMax) return false;
    if (!this.open) return false;

    this.set(item, equip, slot);
    return true;
  }

  /**
   * @returns {Item}
   */
  remove () {
    let item;
    if (!this.empty) {
      item = this.#item;
      this.set(null, null, null);
    }

    return item;
  }

  /**
   * @returns {undefined}
   */
  clear () {
    this.set(null, null, null);
  }


  /** @type {Iterator<Item>} */
  [Symbol.iterator] () {
    return (this.empty ? [] : [this.item])[Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Slot}
   */
  fromJSON (json, reviver) {
    this.item = fromJSON(json, this, "item", (reviver?.item ?? Item.fromJSON));
    this.equip = fromJSON(json, this, "equip", reviver?.equip);
    this.slot = fromJSON(json, this, "slot", reviver?.slot);

    this.Type = fromJSON(json, this, "Type", (reviver?.Type ?? ((constructor) => Item[constructor])));
    this.dimensionMax = fromJSON(json, this, "dimensionMax", reviver?.dimensionMax);
    this.volumeMax = fromJSON(json, this, "volumeMax", reviver?.volumeMax);
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

    json.item = toJSON(this, "item", replacer?.item);
    json.equip = toJSON(this, "equip", replacer?.equip);
    json.slot = toJSON(this, "slot", replacer?.slot);

    json.Type = toJSON(this, "Type", replacer?.Type);
    json.dimensionMax = toJSON(this, "dimensionMax", replacer?.dimensionMax);
    json.volumeMax = toJSON(this, "volumeMax", replacer?.volumeMax);
    json.open = toJSON(this, "open", replacer?.open);

    return json;
  }
};
export default Slot;
