import { fromJSON, toJSON, serializable } from "@kxirk/serialize";
import "@kxirk/utils/number.js";


/**
 * @abstract
 */
const Level = class {
  // #region Instance
  /** @type {number} */ #depthCount;

  /** @type {number} */ #widthMin;
  /** @type {number} */ #widthMax;
  /** @type {number} */ #heightMin;
  /** @type {number} */ #heightMax;


  constructor () {
    this.#depthCount = 0;

    this.#widthMin = 0;
    this.#widthMax = Infinity;
    this.#heightMin = 0;
    this.#heightMax = Infinity;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {number} */
  get depthCount () { return this.#depthCount; }
  set depthCount (count) {
    this.#depthCount = count.clamp(0);
  }


  /** @type {number} */
  get widthMin () { return this.#widthMin; }
  set widthMin (min) {
    this.#widthMin = min.clamp(0);
  }

  /** @type {number} */
  get widthMax () { return this.#widthMax; }
  set widthMax (max) {
    this.#widthMax = max.clamp(this.widthMin);
  }

  /** @type {number} */
  get heightMin () { return this.#heightMin; }
  set heightMin (min) {
    this.#heightMin = min.clamp(0);
  }

  /** @type {number} */
  get heightMax () { return this.#heightMax; }
  set heightMax (max) {
    this.#heightMax = max.clamp(this.heightMin);
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
    this.depthCount = fromJSON(json, this, "depthCount", reviver?.depthCount);

    this.widthMin = fromJSON(json, this, "widthMin", reviver?.widthMin);
    this.widthMax = fromJSON(json, this, "widthMax", (reviver?.widthMax ?? Number.fromJSON));
    this.heightMin = fromJSON(json, this, "heightMin", reviver?.heightMin);
    this.heightMax = fromJSON(json, this, "heightMax", (reviver?.heightMax ?? Number.fromJSON));

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

    json.depthCount = toJSON(this, "depthCount", replacer?.depthCount);

    json.widthMin = toJSON(this, "widthMin", replacer?.widthMin);
    json.widthMax = toJSON(this, "widthMax", replacer?.widthMax);
    json.heightMin = toJSON(this, "heightMin", replacer?.heightMin);
    json.heightMax = toJSON(this, "heightMax", replacer?.heightMax);

    return json;
  }
  // #endregion
};
export default serializable(Level, true);
