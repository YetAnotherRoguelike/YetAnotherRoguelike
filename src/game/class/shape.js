import { fromJSON, toJSON, serializable } from "@kxirk/serialize";
import "@kxirk/utils/array.js";
import "@kxirk/utils/number.js";


/**
 * @abstract
 */
const Shape = class {
  // #region Instance
  /** @type {number} */ #range;
  /** @type {number} */ #decay;


  /**
   * @param {number} range
   * @param {number} decay
   */
  constructor (range, decay) {
    this.range = range;
    this.decay = decay;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {number} */
  get range () { return this.#range; }
  set range (range) {
    this.#range = range.clamp(0);
  }

  /** @type {number} */
  get decay () { return this.#decay; }
  set decay (decay) {
    this.#decay = decay.clamp(0);
  }
  // #endregion


  // #region Serialize
  /** @type {string[]} */ static parameters = ["range", "decay"];


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    this.range = fromJSON(json, this, "range", reviver?.range);
    this.decay = fromJSON(json, this, "decay", reviver?.decay);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};
    json.constructor = toJSON(this, "constructor", replacer?.constructor);

    json.range = toJSON(this, "range", replacer?.range);
    json.decay = toJSON(this, "decay", replacer?.decay);

    return json;
  }
  // #endregion
};
export default serializable(Shape, true);
