import { fromJSON, toJSON } from "@kxirk/serialize";
import Object from "@kxirk/utils/object.js";


/** @enum {string} */
const Equip = class {
  /** @type {string} */
  static armor = "armor";

  /** @type {string} */
  static light = "light";
  /** @type {string} */
  static medium = "medium";
  /** @type {string} */
  static versatile = "versatile";
  /** @type {string} */
  static heavy = "heavy";
  /** @type {string[]} */
  static hands = [this.light, this.medium, this.versatile, this.heavy];

  /** @type {string} */
  static accessory = "accessory";

  /** @type {*} */
  #armor;

  /** @type {*} */
  #light;
  /** @type {*} */
  #medium;
  /** @type {*} */
  #versatile;
  /** @type {*} */
  #heavy;

  /** @type {*} */
  #accessory;

  /**
   * @param {*} [initial]
   */
  constructor (initial = null) {
    this.all = initial;

    Object.assignGettersAsEnumerable(this, Equip);
  }


  /** @type {*} */
  get armor () { return this.#armor; }
  set armor (armor) { this.#armor = armor; }


  /** @type {*} */
  get light () { return this.#light; }
  set light (light) { this.#light = light; }

  /** @type {*} */
  get medium () { return this.#medium; }
  set medium (medium) { this.#medium = medium; }

  /** @type {*} */
  get versatile () { return this.#versatile; }
  set versatile (versatile) { this.#versatile = versatile; }

  /** @type {*} */
  get heavy () { return this.#heavy; }
  set heavy (heavy) { this.#heavy = heavy; }

  /** @type {*} */
  get hands () { return Equip.hands.map((equip) => this[equip]); }
  set hands (value) {
    this.light = value;
    this.medium = value;
    this.versatile = value;
    this.heavy = value;
  }


  /** @type {*} */
  get accessory () { return this.#accessory; }
  set accessory (accessory) { this.#accessory = accessory; }


  /** @type {*} */
  set all (value) {
    this.armor = value;
    this.hands = value;
    this.accessory = value;
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Equip}
   */
  fromJSON (json, reviver) {
    this.armor = fromJSON(json, this, "armor", reviver?.armor);

    this.light = fromJSON(json, this, "light", reviver?.light);
    this.medium = fromJSON(json, this, "medium", reviver?.medium);
    this.versatile = fromJSON(json, this, "versatile", reviver?.versatile);
    this.heavy = fromJSON(json, this, "heavy", reviver?.heavy);

    this.accessory = fromJSON(json, this, "accessory", reviver?.accessory);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.armor = toJSON(this, "armor", replacer?.armor);

    json.light = toJSON(this, "light", replacer?.light);
    json.medium = toJSON(this, "medium", replacer?.medium);
    json.versatile = toJSON(this, "versatile", replacer?.versatile);
    json.heavy = toJSON(this, "heavy", replacer?.heavy);

    json.accessory = toJSON(this, "accessory", replacer?.accessory);

    return json;
  }
};
export default Equip;

Object.defineProperty(Equip.hands, "indexes", {
  /** @enum {number} */
  value: Object.fromEntries(Equip.hands.map((size, i) => [size, i])),
  enumerable: false
});
