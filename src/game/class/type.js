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

  /**
   * @param {Object} json
   * @returns {Type}
   */
  static fromJSON (json) {
    return new Type().fromJSON(json);
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
   * @returns {Type}
   */
  fromJSON (json) {
    this.striking = json.striking;
    this.slashing = json.slashing;
    this.piercing = json.piercing;

    this.fire = json.fire;
    this.ice = json.ice;
    this.lightning = json.lightning;

    this.arcane = json.arcane;
    this.necrotic = json.necrotic;
    this.holy = json.holy;

    this.bleeding = json.bleeding;
    this.acid = json.acid;
    this.poison = json.poison;
    this.psychic = json.psychic;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      striking: this.striking,
      slashing: this.slashing,
      piercing: this.piercing,

      fire: this.fire,
      ice: this.ice,
      lightning: this.lightning,

      arcane: this.arcane,
      necrotic: this.necrotic,
      holy: this.holy,

      bleeding: this.bleeding,
      acid: this.acid,
      poison: this.poison,
      psychic: this.psychic
    };
  }
};
export default Type;
