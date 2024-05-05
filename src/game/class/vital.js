import "@kxirk/utils/number.js";
import { Object } from "@kxirk/utils";


const Vital = class {
  /** @type {number} */
  #health;
  /** @type {number} */
  #regen; // reset on taking damage

  /**
   * @param {number} [initial]
   */
  constructor (initial = 0) {
    this.health = initial;

    Object.assignGettersAsEnumerable(this, Vital);
  }

  /**
   * @param {Object} json
   * @returns {Vital}
   */
  static fromJSON (json) {
    return new Vital().fromJSON(json);
  }


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


  /**
   * @param {Object} json
   * @returns {Vital}
   */
  fromJSON (json) {
    this.health = json.health;
    this.regen = json.regen;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      health: this.health,
      regen: this.regen
    };
  }
};
export default Vital;
