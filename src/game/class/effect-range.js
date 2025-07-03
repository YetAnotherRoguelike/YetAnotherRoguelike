import Random from "@kxirk/random";
import { fromJSON, toJSON } from "@kxirk/serialize";
import Math from "@kxirk/utils/math.js";


const EffectRange = class {
  // #region Instance
  /** @type {number} */ #min;
  /** @type {number} */ #max;
  /** @type {number} */ #avg;


  /**
   * @param {number} [min]
   * @param {number} [max]
   * @param {number} [avg]
   */
  constructor (min = 0, max = 0, avg = Math.average(min, max)) {
    this.set(min, max, avg);
  }
  // #endregion

  // #region Instance Accessors
  /** @type {number} */
  get min () { return this.#min; }
  set min (min) { this.#min = min; }

  /** @type {number} */
  get max () { return this.#max; }
  set max (max) { this.#max = max; }

  /** @type {number} */
  get avg () { return this.#avg; }
  set avg (avg) { this.#avg = avg; }
  // #endregion

  // #region Instance Methods
  /** @type {number} */
  get range () {
    if (Number.isFinite(this.min) && Number.isFinite(this.max)) {
      return (this.max - this.min);
    }

    return undefined;
  }


  /**
   * @param {number} min
   * @param {number} max
   * @param {number} avg
   * @returns {this}
   */
  set (min, max, avg = Math.average(min, max)) {
    this.min = min;
    this.max = max;
    this.avg = avg;

    return this;
  }


  /**
   * @returns {number}
   */
  valueOf () {
    if (this.range) {
      return Random.shared.nextTriangular(this.min, this.max, this.avg);
    }
    return this.avg;
  }

  /**
   * @returns {Iterator<number>}
   */
  * [Symbol.iterator] () {
    yield this.min;
    yield this.max;
    yield this.avg;
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
    this.min = fromJSON(json, this, "min", reviver?.min);
    this.max = fromJSON(json, this, "max", reviver?.max);
    this.avg = fromJSON(json, this, "avg", reviver?.avg);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.min = toJSON(this, "min", replacer?.min);
    json.max = toJSON(this, "max", replacer?.max);
    json.avg = toJSON(this, "avg", replacer?.avg);

    return json;
  }
  // #endregion
};
export default EffectRange;
