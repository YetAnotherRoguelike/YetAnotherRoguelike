import { fromJSON, toJSON } from "@kxirk/serialize";
import { Object } from "@kxirk/utils";


const Type = class {
  /** @type {string[]} */
  static physical = ["striking", "slashing", "piercing"];
  /** @type {*} */
  #striking;
  /** @type {*} */
  #slashing;
  /** @type {*} */
  #piercing;

  /** @type {string[]} */
  static elemental = ["fire", "ice", "lightning"];
  /** @type {*} */
  #fire;
  /** @type {*} */
  #ice;
  /** @type {*} */
  #lightning;

  /** @type {string[]} */
  static magical = ["arcane", "necrotic", "holy"];
  /** @type {*} */
  #arcane;
  /** @type {*} */
  #necrotic;
  /** @type {*} */
  #holy;

  /** @type {*} */
  #bleeding;
  /** @type {*} */
  #acid;
  /** @type {*} */
  #poison;
  /** @type {*} */
  #psychic;

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
    this.striking = physical;
    this.slashing = physical;
    this.piercing = physical;
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
    this.fire = elemental;
    this.ice = elemental;
    this.lightning = elemental;
  }


  /** @type {*} */
  get arcane () { return this.#arcane; }
  set arcane (arcane) { this.#arcane = arcane; }

  /** @type {*} */
  get necrotic () { return this.#necrotic; }
  set necrotic (necrotic) { this.#necrotic = necrotic; }

  /** @type {*} */
  get holy () { return this.#holy; }
  set holy (holy) { this.#holy = holy; }

  /** @type {*} */
  set magical (magical) {
    this.arcane = magical;
    this.necrotic = magical;
    this.holy = magical;
  }


  /** @type {*} */
  get bleeding () { return this.#bleeding; }
  set bleeding (bleeding) { this.#bleeding = bleeding; }

  /** @type {*} */
  get acid () { return this.#acid; }
  set acid (acid) { this.#acid = acid; }

  /** @type {*} */
  get poison () { return this.#poison; }
  set poison (poison) { this.#poison = poison; }

  /** @type {*} */
  get psychic () { return this.#psychic; }
  set psychic (psychic) { this.#psychic = psychic; }


  /** @type {*} */
  set all (value) {
    this.physical = value;
    this.elemental = value;
    this.magical = value;
    this.bleeding = value;
    this.acid = value;
    this.poison = value;
    this.psychic = value;
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
    this.necrotic = fromJSON(json, this, "necrotic", reviver?.necrotic);
    this.holy = fromJSON(json, this, "holy", reviver?.holy);

    this.bleeding = fromJSON(json, this, "bleeding", reviver?.bleeding);
    this.acid = fromJSON(json, this, "acid", reviver?.acid);
    this.poison = fromJSON(json, this, "poison", reviver?.poison);
    this.psychic = fromJSON(json, this, "psychic", reviver?.psychic);

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
    json.necrotic = toJSON(this, "necrotic", replacer?.necrotic);
    json.holy = toJSON(this, "holy", replacer?.holy);

    json.bleeding = toJSON(this, "bleeding", replacer?.bleeding);
    json.acid = toJSON(this, "acid", replacer?.acid);
    json.poison = toJSON(this, "poison", replacer?.poison);
    json.psychic = toJSON(this, "psychic", replacer?.psychic);

    return json;
  }
};
export default Type;
