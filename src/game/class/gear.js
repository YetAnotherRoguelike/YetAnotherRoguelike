import "@kxirk/utils/number.js";

import Item from "./item.js";


const Gear = class extends Item {
  /** @type {number} */
  #quality; // [-5, 15]

  /** @type {keyof Ability} */
  #scaleAbility;
  /** @type {number} */
  #scaleMin;
  /** @type {number} */
  #scaleMax;

  /** @type {Stat} */
  #statBase;
  /** @type {Stat} */
  #statQuality;
  /** @type {Stat} */
  #statScale;

  /** @type {number} */
  #durabilityBase;
  /** @type {number} */
  #durabilityQuality;
  /** @type {number} */
  #durability;

  constructor () {
    super();
    this.equip = null;

    this.quality = 0;

    this.scaleAbility = null;
    this.scaleMin = 0;
    this.scaleMax = 0;

    this.#statBase = {};
    this.#statQuality = {};
    this.#statScale = {};

    this.durabilityBase = 0;
    this.durabilityQuality = 0;
    this.durability = 0;
  }

  /**
   * @param {Object} json
   * @returns {Gear}
   */
  static fromJSON (json) {
    return new Gear().fromJSON(json);
  }


  /** @type {number} */
  get quality () { return this.#quality; }
  set quality (quality) {
    this.#quality = quality.clamp(-5, 15);
  }

  /** @type {number} */
  get qualityFactor () {
    return (1 + (0.05 * this.quality));
  }


  /** @type {string} */
  get scaleAbility () { return this.#scaleAbility; }
  set scaleAbility (ability) {
    this.#scaleAbility = ability;
  }

  /** @type {number} */
  get scaleMin () { return this.#scaleMin; }
  set scaleMin (min) {
    this.#scaleMin = min.clamp(0);
  }

  /** @type {number} */
  get scaleMax () { return this.#scaleMax; }
  set scaleMax (max) {
    this.#scaleMax = max.clamp(0);
  }


  /** @type {Stat} */
  get statBase () { return this.#statBase; }

  /** @type {Stat} */
  get statQuality () { return this.#statQuality; }

  /** @type {Stat} */
  get statScale () { return this.#statScale; }


  /** @type {number} */
  get durabilityBase () { return this.#durabilityBase; }
  set durabilityBase (durability) {
    this.#durabilityBase = durability.clamp(0);
  }

  /** @type {number} */
  get durabilityQuality () { return this.#durabilityQuality; }
  set durabilityQuality (durability) {
    this.#durabilityQuality = durability.clamp(0);
  }

  /** @type {number} */
  get durabilityMax () {
    return (this.durabilityBase + (this.qualityFactor * this.durabilityQuality));
  }

  /** @type {number} */
  get durability () { return this.#durability; }
  set durability (durability) {
    this.#durability = durability.clamp(0);
  }

  /** @type {number} */
  get durabilityFactor () { return (this.durability / this.durabilityMax); }


  /**
   * @param {Object} json
   * @returns {Gear}
   */
  fromJSON (json) {
    super.fromJSON(json);

    this.quality = json.quality;

    this.scaleAbility = json.scaleAbility;
    this.scaleMin = json.scaleMin;
    this.scaleMax = json.scaleMax;

    Object.assign(this.statBase, json.statBase);
    Object.assign(this.statQuality, json.statQuality);
    Object.assign(this.statScale, json.statScale);

    this.durabilityBase = json.durabilityBase;
    this.durabilityQuality = json.durabilityQuality;
    this.durability = json.durability;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    const json = super.toJSON();

    json.quality = this.quality;

    json.scaleAbility = this.scaleAbility;
    json.scaleMin = this.scaleMin;
    json.scaleMax = this.scaleMax;

    json.statBase = this.statBase;
    json.statQuality = this.statQuality;
    json.statScale = this.statScale;

    json.durabilityBase = this.durabilityBase;
    json.durabilityQuality = this.durabilityQuality;
    json.durability = this.durability;

    return json;
  }
};
export default Gear;
