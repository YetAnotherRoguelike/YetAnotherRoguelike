import { fromJSON, toJSON } from "@kxirk/serialize";


/**
 * @enum {string}
 * @template T
 */
const Equip = class {
  // #region Enum
  static armor = "armor";

  static light = "light";
  static medium = "medium";
  static versatile = "versatile";
  static heavy = "heavy";

  static accessory = "accessory";


  /** @type {string[]} */ static hands = [this.light, this.medium, this.versatile, this.heavy];
  // #endregion


  // #region Instance
  /** @type {T} */ #armor;

  /** @type {T} */ #light;
  /** @type {T} */ #medium;
  /** @type {T} */ #versatile;
  /** @type {T} */ #heavy;

  /** @type {T} */ #accessory;


  /**
   * @param {T} [initial]
   */
  constructor (initial = null) {
    this.all = initial;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {T} */
  get armor () { return this.#armor; }
  set armor (armor) { this.#armor = armor; }


  /** @type {T} */
  get light () { return this.#light; }
  set light (light) { this.#light = light; }

  /** @type {T} */
  get medium () { return this.#medium; }
  set medium (medium) { this.#medium = medium; }

  /** @type {T} */
  get versatile () { return this.#versatile; }
  set versatile (versatile) { this.#versatile = versatile; }

  /** @type {T} */
  get heavy () { return this.#heavy; }
  set heavy (heavy) { this.#heavy = heavy; }

  /** @type {T[]} */
  get hands () {
    return Equip.hands.map((equip) => this[equip]);
  }
  /** @type {T} */
  set hands (hands) {
    for (const equip of Equip.hands) this[equip] = hands;
  }


  /** @type {T} */
  get accessory () { return this.#accessory; }
  set accessory (accessory) { this.#accessory = accessory; }


  /** @type {T} */
  set all (value) {
    this.armor = value;
    this.hands = value;
    this.accessory = value;
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
  // #endregion
};
export default Equip;

Object.defineProperty(Equip.hands, "indexes", {
  /**
   * @enum {number}
   */
  value: Object.fromEntries(Equip.hands.map((size, i) => [size, i])),
  enumerable: false
});
