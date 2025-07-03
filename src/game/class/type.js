import { fromJSON, toJSON } from "@kxirk/serialize";
import Object from "@kxirk/utils/object.js";


/**
 * @enum {string}
 * @template T
 */
const Type = class {
  // #region Enum
  static striking = "striking";
  static slashing = "slashing";
  static piercing = "piercing";

  static fire = "fire";
  static ice = "ice";
  static lightning = "lightning";

  static arcane = "arcane";
  static dark = "dark";
  static holy = "holy";

  static bleeding = "bleeding";
  static poison = "poison";


  /** @type {string[]} */ static physical = [this.striking, this.slashing, this.piercing];
  /** @type {string[]} */ static elemental = [this.fire, this.ice, this.lightning];
  /** @type {string[]} */ static magical = [this.arcane, this.dark, this.holy];

  /** @type {string[]} */ static groups = ["physical", "elemental", "magical"];
  // #endregion


  // #region Instance
  /** @type {T} */ #striking;
  /** @type {T} */ #slashing;
  /** @type {T} */ #piercing;

  /** @type {T} */ #fire;
  /** @type {T} */ #ice;
  /** @type {T} */ #lightning;

  /** @type {T} */ #arcane;
  /** @type {T} */ #dark;
  /** @type {T} */ #holy;

  /** @type {T} */ #bleeding;
  /** @type {T} */ #poison;


  /**
   * @param {T} [initial]
   */
  constructor (initial = null) {
    this.all = initial;


    Object.assignGettersAsEnumerable(this, Type);
  }
  // #endregion

  // #region Instance Accessors
  /** @type {T} */
  get striking () { return this.#striking; }
  set striking (striking) { this.#striking = striking; }

  /** @type {T} */
  get slashing () { return this.#slashing; }
  set slashing (slashing) { this.#slashing = slashing; }

  /** @type {T} */
  get piercing () { return this.#piercing; }
  set piercing (piercing) { this.#piercing = piercing; }

  /** @type {T} */
  set physical (physical) {
    for (const type of Type.physical) this[type] = physical;
  }


  /** @type {T} */
  get fire () { return this.#fire; }
  set fire (fire) { this.#fire = fire; }

  /** @type {T} */
  get ice () { return this.#ice; }
  set ice (ice) { this.#ice = ice; }

  /** @type {T} */
  get lightning () { return this.#lightning; }
  set lightning (lightning) { this.#lightning = lightning; }

  /** @type {T} */
  set elemental (elemental) {
    for (const type of Type.elemental) this[type] = elemental;
  }


  /** @type {T} */
  get arcane () { return this.#arcane; }
  set arcane (arcane) { this.#arcane = arcane; }

  /** @type {T} */
  get dark () { return this.#dark; }
  set dark (dark) { this.#dark = dark; }

  /** @type {T} */
  get holy () { return this.#holy; }
  set holy (holy) { this.#holy = holy; }

  /** @type {T} */
  set magical (magical) {
    for (const type of Type.magical) this[type] = magical;
  }


  /** @type {T} */
  get bleeding () { return this.#bleeding; }
  set bleeding (bleeding) { this.#bleeding = bleeding; }

  /** @type {T} */
  get poison () { return this.#poison; }
  set poison (poison) { this.#poison = poison; }


  /** @type {T} */
  set all (value) {
    this.physical = value;
    this.elemental = value;
    this.magical = value;
    this.bleeding = value;
    this.poison = value;
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
    this.striking = fromJSON(json, this, "striking", reviver?.striking);
    this.slashing = fromJSON(json, this, "slashing", reviver?.slashing);
    this.piercing = fromJSON(json, this, "piercing", reviver?.piercing);

    this.fire = fromJSON(json, this, "fire", reviver?.fire);
    this.ice = fromJSON(json, this, "ice", reviver?.ice);
    this.lightning = fromJSON(json, this, "lightning", reviver?.lightning);

    this.arcane = fromJSON(json, this, "arcane", reviver?.arcane);
    this.dark = fromJSON(json, this, "dark", reviver?.dark);
    this.holy = fromJSON(json, this, "holy", reviver?.holy);

    this.bleeding = fromJSON(json, this, "bleeding", reviver?.bleeding);
    this.poison = fromJSON(json, this, "poison", reviver?.poison);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.striking = toJSON(this, "striking", replacer?.striking);
    json.slashing = toJSON(this, "slashing", replacer?.slashing);
    json.piercing = toJSON(this, "piercing", replacer?.piercing);

    json.fire = toJSON(this, "fire", replacer?.fire);
    json.ice = toJSON(this, "ice", replacer?.ice);
    json.lightning = toJSON(this, "lightning", replacer?.lightning);

    json.arcane = toJSON(this, "arcane", replacer?.arcane);
    json.dark = toJSON(this, "dark", replacer?.dark);
    json.holy = toJSON(this, "holy", replacer?.holy);

    json.bleeding = toJSON(this, "bleeding", replacer?.bleeding);
    json.poison = toJSON(this, "poison", replacer?.poison);

    return json;
  }
  // #endregion
};
export default Type;
