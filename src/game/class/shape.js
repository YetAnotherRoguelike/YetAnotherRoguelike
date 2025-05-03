import "@kxirk/utils/number.js";
import { fromJSON, toJSON } from "@kxirk/serialize";


const Shape = class {
  /** @type {number} */
  #range;
  /** @type {number} */
  #decay;

  /**
   * @param {number} range
   * @param {number} decay
   */
  constructor (range, decay) {
    this.range = range;
    this.decay = decay;
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Shape}
   */
  static fromJSON (json, reviver) {
    return new Shape[json.constructor]().fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
  }


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


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Shape}
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
};
export default Shape;
