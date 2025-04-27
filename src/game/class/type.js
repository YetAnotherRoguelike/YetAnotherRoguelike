import { fromJSON, toJSON } from "@kxirk/serialize";
import { Object } from "@kxirk/utils";


const Type = class {
  /** @type {string[]} */
  static groups = ["physical", "elemental", "magical"];

  /** @type {string} */
  static striking = "striking";
  /** @type {string} */
  static slashing = "slashing";
  /** @type {string} */
  static piercing = "piercing";
  /** @type {string[]} */
  static physical = [this.striking, this.slashing, this.piercing];

  /** @type {string} */
  static fire = "fire";
  /** @type {string} */
  static ice = "ice";
  /** @type {string} */
  static lightning = "lightning";
  /** @type {string[]} */
  static elemental = [this.fire, this.ice, this.lightning];

  /** @type {string} */
  static arcane = "arcane";
  /** @type {string} */
  static dark = "dark";
  /** @type {string} */
  static holy = "holy";
  /** @type {string[]} */
  static magical = [this.arcane, this.dark, this.holy];

  /** @type {string} */
  static bleeding = "bleeding";
  /** @type {string} */
  static poison = "poison";

  /** @type {*} */
  #striking;
  /** @type {*} */
  #slashing;
  /** @type {*} */
  #piercing;

  /** @type {*} */
  #fire;
  /** @type {*} */
  #ice;
  /** @type {*} */
  #lightning;

  /** @type {*} */
  #arcane;
  /** @type {*} */
  #dark;
  /** @type {*} */
  #holy;

  /** @type {*} */
  #bleeding;
  /** @type {*} */
  #poison;

  /**
   * @param {*} [initial]
   */
  constructor (initial = null) {
    this.all = initial;

    Object.assignGettersAsEnumerable(this, Type);
  }


  /** @type {*} */
  get striking () { return this.#striking; }
  set striking (striking) { this.#striking = striking; }

  /** @type {*} */
  get slashing () { return this.#slashing; }
  set slashing (slashing) { this.#slashing = slashing; }

  /** @type {*} */
  get piercing () { return this.#piercing; }
  set piercing (piercing) { this.#piercing = piercing; }

  /** @type {*} */
  set physical (physical) {
    for (const type of Type.physical) {
      this[type] = physical;
    }
  }


  /** @type {*} */
  get fire () { return this.#fire; }
  set fire (fire) { this.#fire = fire; }

  /** @type {*} */
  get ice () { return this.#ice; }
  set ice (ice) { this.#ice = ice; }

  /** @type {*} */
  get lightning () { return this.#lightning; }
  set lightning (lightning) { this.#lightning = lightning; }

  /** @type {*} */
  set elemental (elemental) {
    for (const type of Type.elemental) {
      this[type] = elemental;
    }
  }


  /** @type {*} */
  get arcane () { return this.#arcane; }
  set arcane (arcane) { this.#arcane = arcane; }

  /** @type {*} */
  get dark () { return this.#dark; }
  set dark (dark) { this.#dark = dark; }

  /** @type {*} */
  get holy () { return this.#holy; }
  set holy (holy) { this.#holy = holy; }

  /** @type {*} */
  set magical (magical) {
    for (const type of Type.magical) {
      this[type] = magical;
    }
  }


  /** @type {*} */
  get bleeding () { return this.#bleeding; }
  set bleeding (bleeding) { this.#bleeding = bleeding; }

  /** @type {*} */
  get poison () { return this.#poison; }
  set poison (poison) { this.#poison = poison; }


  /** @type {*} */
  set all (value) {
    this.physical = value;
    this.elemental = value;
    this.magical = value;
    this.bleeding = value;
    this.poison = value;
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Type}
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
};
export default Type;
