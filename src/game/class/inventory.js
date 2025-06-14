import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/array.js";

import Item from "./item.js";


export const smallFactor = 0.1;
export const smallDimensionFactor = 0.15;
export const smallVolumeFactor = 0.025;

const Inventory = class {
  /** @type {Class<Item>} */
  #Type;
  /** @type {Item[]} */
  #items;

  /** @type {number} */
  #sizeMax;
  /** @type {number} */
  #volumeMax;

  /** @type {number} */
  #itemDimensionMax;
  /** @type {number} */
  #itemVolumeMax;

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

  /**
   * @param {Item} item
   * @returns {boolean}
   */
  #small (item) {
    if (this.itemDimensionMax === Infinity && this.itemVolumeMax === Infinity) return false;

    const dimension = item.dimensionMax <= (smallDimensionFactor * this.itemDimensionMax);
    const volume = item.volume <= (smallVolumeFactor * this.itemVolumeMax);
    return (dimension && volume);
  }


  /** @type {Class<Item>} */
  get Type () { return this.#Type; }
  set Type (Type) { this.#Type = Type; }

  /** @type {number} */
  get size () { return this.#items.reduce((size, item) => size + (this.#small(item) ? smallFactor : 1), 0); }

  /** @type {number} */
  get volume () { return this.#items.reduce((volume, item) => volume + item.volume, 0); }

  /** @type {number} */
  get weight () { return this.#items.reduce((weight, item) => weight + item.weight, 0); }


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

    if (this.size >= this.sizeMax) return false;
    if (this.volume > this.volumeMax) return false;

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


  /** @type {Iterator<Item>} */
  [Symbol.iterator] () {
    return this.#items[Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Inventory}
   */
  fromJSON (json, reviver) {
    this.Type = fromJSON(json, this, "Type", (reviver?.Type ?? ((constructor) => Item[constructor])));
    fromJSON(json, this, "items", (reviver?.items ?? { value: Item.fromJSON }));

    this.sizeMax = fromJSON(json, this, "sizeMax", reviver?.sizeMax);
    this.volumeMax = fromJSON(json, this, "volumeMax", reviver?.volumeMax);

    this.itemDimensionMax = fromJSON(json, this, "itemDimensionMax", reviver?.itemDimensionMax);
    this.itemVolumeMax = fromJSON(json, this, "itemVolumeMax", reviver?.itemVolumeMax);

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
};
export default Inventory;
