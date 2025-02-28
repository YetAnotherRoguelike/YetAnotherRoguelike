import Random from "@kxirk/random";
import { fromJSON, toJSON } from "@kxirk/serialize";
import Math from "@kxirk/utils/math.js";
import Number from "@kxirk/utils/number.js";


const EffectRange = class {
  /** @type {number} */
  #min;
  /** @type {number} */
  #max;
  /** @type {number} */
  #avg;

  /**
   * @param {number} [min]
   * @param {number} [max]
   * @param {number} [avg]
   */
  constructor (min = 0, max = 0, avg = Math.average(min, max)) {
    this.set(min, max, avg);
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {EffectRange}
   */
  static fromJSON (json, reviver) {
    return new EffectRange(json.min, json.max, json.avg).fromJSON(json, reviver);
  }


  /** @type {number} */
  get min () { return this.#min; }
  set min (min) { this.#min = min; }

  /** @type {number} */
  get max () { return this.#max; }
  set max (max) { this.#max = max; }

  /** @type {number} */
  get avg () { return this.#avg; }
  set avg (avg) { this.#avg = avg; }

  /**
   * @param {number} min
   * @param {number} max
   * @param {number} avg
   * @returns {undefined}
   */
  set (min, max, avg = Math.average(min, max)) {
    this.min = min ?? this.min;
    this.max = max ?? this.max;
    this.avg = avg ?? this.avg;
  }


  /** @type {number} */
  valueOf () {
    if (Number.isFinite(this.min) && Number.isFinite(this.max)) {
      return Random.shared.nextTriangular(this.min, this.max, this.avg).round();
    }
    return this.avg.round();
  }

  /** @type {Iterator<number>} */
  [Symbol.iterator] () {
    const array = [this.min, this.max, this.avg];

    return array[Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Effect}
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
};
export default EffectRange;
