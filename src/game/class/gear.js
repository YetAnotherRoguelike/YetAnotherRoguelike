import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Item from "./item.js";


/** @abstract */
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

    this.#quality = 0;

    this.#scaleAbility = null;
    this.#scaleMin = 0;
    this.#scaleMax = 0;

    this.#statBase = {};
    this.#statQuality = {};
    this.#statScale = {};

    this.#durabilityBase = 0;
    this.#durabilityQuality = 0;
    this.#durability = 0;
  }


  /** @type {number} */
  get quality () { return this.#quality; }
  set quality (quality) {
    this.#quality = quality.clamp(-5, 15);
  }

  /** @type {number} */
  get qualityModifier () {
    return (this.quality / 5);
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
    return (this.durabilityBase + (this.qualityModifier * this.durabilityQuality)).clamp(1);
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
   * @param {Function} [reviver]
   * @returns {Gear}
   */
  fromJSON (json, reviver) {
    super.fromJSON(json, reviver);

    this.quality = fromJSON(json, this, "quality", reviver?.quality);

    this.scaleAbility = fromJSON(json, this, "scaleAbility", reviver?.scaleAbility);
    this.scaleMin = fromJSON(json, this, "scaleMin", reviver?.scaleMin);
    this.scaleMax = fromJSON(json, this, "scaleMax", reviver?.scaleMax);

    fromJSON(json, this, "statBase", reviver?.statBase);
    fromJSON(json, this, "statQuality", reviver?.statQuality);
    fromJSON(json, this, "statScale", reviver?.statScale);

    this.durabilityBase = fromJSON(json, this, "durabilityBase", reviver?.durabilityBase);
    this.durabilityQuality = fromJSON(json, this, "durabilityQuality", reviver?.durabilityQuality);
    this.durability = fromJSON(json, this, "durability", reviver?.durability);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    json.quality = toJSON(this, "quality", replacer?.quality);

    json.scaleAbility = toJSON(this, "quality", replacer?.quality);
    json.scaleMin = toJSON(this, "quality", replacer?.quality);
    json.scaleMax = toJSON(this, "quality", replacer?.quality);

    json.statBase = toJSON(this, "quality", replacer?.quality);
    json.statQuality = toJSON(this, "quality", replacer?.quality);
    json.statScale = toJSON(this, "quality", replacer?.quality);

    json.durabilityBase = toJSON(this, "quality", replacer?.quality);
    json.durabilityQuality = toJSON(this, "quality", replacer?.quality);
    json.durability = toJSON(this, "quality", replacer?.quality);

    return json;
  }
};
export default Gear;
