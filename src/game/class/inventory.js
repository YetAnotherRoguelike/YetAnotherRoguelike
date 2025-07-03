import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/array.js";
import "@kxirk/utils/number.js";

import Item from "./item.js";


const Inventory = class {
  // #region Static
  /** @type {number} */ static smallFactor = 0.1;
  /** @type {number} */ static smallDimensionFactor = 0.15;
  /** @type {number} */ static smallVolumeFactor = 0.025;
  // #endregion


  // #region Instance
  /** @type {Class<Item>} */ #Type;
  /** @type {Item[]} */ #items;

  /** @type {number} */ #sizeMax;
  /** @type {number} */ #volumeMax;

  /** @type {number} */ #itemDimensionMax;
  /** @type {number} */ #itemVolumeMax;


  /**
   * @param {Class<Item>} [Type]
   * @param {number} [sizeMax]
   * @param {number} [volumeMax]
   * @param {number} [itemDimensionMax]
   * @param {number} [itemVolumeMax]
   */
  constructor (Type = Item, sizeMax = Infinity, volumeMax = Infinity, itemDimensionMax = Infinity, itemVolumeMax = Infinity) {
    this.#Type = Type;
    this.#items = [];

    this.sizeMax = sizeMax;
    this.volumeMax = volumeMax;

    this.itemDimensionMax = itemDimensionMax;
    this.itemVolumeMax = itemVolumeMax;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {Class<Item>} */
  get Type () { return this.#Type; }
  set Type (Type) { this.#Type = Type; }


  /** @type {number} */
  get sizeMax () { return this.#sizeMax; }
  set sizeMax (sizeMax) {
    this.#sizeMax = sizeMax.clamp(0);
  }

  /** @type {number} */
  get volumeMax () { return this.#volumeMax; }
  set volumeMax (volumeMax) {
    this.#volumeMax = volumeMax.clamp(0);
  }


  /** @type {number} */
  get itemDimensionMax () { return this.#itemDimensionMax; }
  set itemDimensionMax (itemDimensionMax) {
    this.#itemDimensionMax = itemDimensionMax.clamp(0);
  }

  /** @type {number} */
  get itemVolumeMax () { return this.#itemVolumeMax; }
  set itemVolumeMax (itemVolumeMax) {
    this.#itemVolumeMax = itemVolumeMax.clamp(0);
  }
  // #endregion

  // #region Instance Derived Properties
  /** @type {number} */
  get size () {
    return this.#items.reduce((size, item) => (size + this.#size(item)), 0);
  }

  /** @type {number} */
  get volume () {
    return this.#items.reduce((volume, item) => (volume + item.volume), 0);
  }

  /** @type {number} */
  get weight () {
    return this.#items.reduce((weight, item) => (weight + item.weight), 0);
  }
  // #endregion

  // #region Instance Methods
  /**
   * @param {Item} item
   * @returns {boolean}
   */
  #small (item) {
    if ((this.itemDimensionMax === Infinity) && (this.itemVolumeMax === Infinity)) return false;

    const dimension = (item.dimensionMax <= (Inventory.smallDimensionFactor * this.itemDimensionMax));
    const volume = (item.volume <= (Inventory.smallVolumeFactor * this.itemVolumeMax));
    return (dimension && volume);
  }

  /**
   * @param {Item} item
   * @returns {number}
   */
  #size (item) {
    return (this.#small(item) ? Inventory.smallFactor : 1);
  }


  /**
   * @param {number} index
   * @returns {Item}
   */
  at (index) {
    return this.#items.at(index);
  }

  /**
   * @param {Item} item
   * @returns {boolean}
   */
  add (item) {
    if (!(item instanceof this.Type)) return false;

    if (item.dimensionMax > this.itemDimensionMax) return false;
    if (item.volume > this.itemVolumeMax) return false;

    if ((this.size + this.#size(item)) >= this.sizeMax) return false;
    if ((this.volume + item.volume) > this.volumeMax) return false;

    this.#items.push(item);
    return true;
  }

  /**
   * @param {number} index
   * @returns {Item}
   */
  remove (index) {
    const item = this.#items.remove(index);

    return item;
  }


  /**
   * @returns {Iterator<Item>}
   */
  [Symbol.iterator] () {
    return this.#items[Symbol.iterator]();
  }
  // #endregion


  // #region Serialize
  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    this.Type = fromJSON(json, this, "Type", (reviver?.Type ?? ((constructor) => Item.resolve(constructor))));
    fromJSON(json, this, "items", (reviver?.items ?? { value: Item.fromJSON }));

    this.sizeMax = fromJSON(json, this, "sizeMax", (reviver?.sizeMax ?? Number.fromJSON));
    this.volumeMax = fromJSON(json, this, "volumeMax", (reviver?.volumeMax ?? Number.fromJSON));

    this.itemDimensionMax = fromJSON(json, this, "itemDimensionMax", (reviver?.itemDimensionMax ?? Number.fromJSON));
    this.itemVolumeMax = fromJSON(json, this, "itemVolumeMax", (reviver?.itemVolumeMax ?? Number.fromJSON));

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
    json.items = toJSON(this.#items, undefined, replacer?.items);

    json.sizeMax = toJSON(this, "sizeMax", replacer?.sizeMax);
    json.volumeMax = toJSON(this, "volumeMax", replacer?.volumeMax);

    json.itemDimensionMax = toJSON(this, "itemDimensionMax", replacer?.itemDimensionMax);
    json.itemVolumeMax = toJSON(this, "itemVolumeMax", replacer?.itemVolumeMax);

    return json;
  }
  // #endregion
};
export default Inventory;
