import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";
import Object from "@kxirk/utils/object.js";

import Type from "./type.js";


const Vital = class {
  // #region Static
  /** @type {string[]} */ static types = ["Buildup"];


  /**
   * @param {string} vital
   * @typedef {string} universal
   * @typedef {string} group
   * @typedef {string} vital
   * @returns {[universal, group, vital]}
   */
  static type (vital) {
    let universal;
    let group;

    const [type, suffix] = vital.split(new RegExp(`(${this.types.join("|")})`, "g"));
    if (suffix) {
      universal = suffix.toLowerCase();

      const typeGroup = Type.groups.find((g) => Type[g].includes(type));
      if (typeGroup) {
        group = `${typeGroup}${suffix}`;
      }
    }

    return [universal, group, vital];
  }
  // #endregion


  // #region Instance
  /** @type {number} */ #health;

  /** @type {number} */ #regen; // reset on taking damage

  /** @type {number} */ #energy;
  /** @type {number} */ #energyOverflow;

  /** @type {Type<number>} */ #buildup; // damage sustained before applying mob.condition for a given type, decreases each turn


  /**
   * @param {number} [initial]
   */
  constructor (initial = 0) {
    this.health = initial;

    this.regen = initial;

    this.energy = initial;
    this.energyOverflow = initial;

    this.#buildup = new Type(initial); Object.assignGettersSettersAs(this, this.#buildup, (type) => `${type}Buildup`);


    Object.assignGettersAsEnumerable(this, Vital);
  }
  // #endregion

  // #region Instance Accessors
  /** @type {number} */
  get health () { return this.#health; }
  set health (health) {
    this.#health = health.clamp(0);
  }


  /** @type {number} */
  get regen () { return this.#regen; }
  set regen (regen) {
    this.#regen = regen.clamp(0);
  }


  /** @type {number} */
  get energy () { return this.#energy; }
  set energy (energy) {
    this.#energy = energy.clamp(0);
  }

  /** @type {number} */
  get energyOverflow () { return this.#energyOverflow; }
  set energyOverflow (energy) {
    this.#energyOverflow = energy.clamp(0);
  }


  /** @type {Type} */
  get buildup () { return this.#buildup; }
  /** @type {number} */
  set buildup (buildup) {
    this.#buildup.all = buildup.clamp(0);
  }
  /** @type {number} */
  set physicalBuildup (buildup) {
    this.#buildup.physical = buildup.clamp(0);
  }
  /** @type {number} */
  set elementalBuildup (buildup) {
    this.#buildup.elemental = buildup.clamp(0);
  }
  /** @type {number} */
  set magicalBuildup (buildup) {
    this.#buildup.magical = buildup.clamp(0);
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
    this.health = fromJSON(json, this, "health", reviver?.health);

    this.regen = fromJSON(json, this, "regen", reviver?.regen);

    this.energy = fromJSON(json, this, "energy", reviver?.energy);
    this.energyOverflow = fromJSON(json, this, "energyOverflow", reviver?.energyOverflow);

    fromJSON(json, this, "buildup", reviver?.buildup);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.health = toJSON(this, "health", replacer?.health);

    json.regen = toJSON(this, "regen", replacer?.regen);

    json.energy = toJSON(this, "energy", replacer?.energy);
    json.energyOverflow = toJSON(this, "energyOverflow", replacer?.energyOverflow);

    json.buildup = toJSON(this, "buildup", replacer?.buildup);

    return json;
  }
  // #endregion
};
export default Vital;
