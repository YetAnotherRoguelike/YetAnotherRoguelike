import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";


/** @abstract */
const Level = class {
  /** @type {number} */
  #depthCount;

  /** @type {number} */
  #widthMin;
  /** @type {number} */
  #widthMax;
  /** @type {number} */
  #heightMin;
  /** @type {number} */
  #heightMax;

  constructor () {
    this.#depthCount = 0;

    this.#widthMin = 0;
    this.#widthMax = Infinity;
    this.#heightMin = 0;
    this.#heightMax = Infinity;
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Level}
   */
  static fromJSON (json, reviver) {
    return new Level[json.constructor]().fromJSON(json, reviver);
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


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Level}
   */
  fromJSON (json, reviver) {
    this.depthCount = fromJSON(json, this, "depthCount", reviver?.depthCount);

    this.widthMin = fromJSON(json, this, "widthMin", reviver?.widthMin);
    this.widthMax = fromJSON(json, this, "widthMax", reviver?.widthMax);
    this.heightMin = fromJSON(json, this, "heightMin", reviver?.heightMin);
    this.heightMax = fromJSON(json, this, "heightMax", reviver?.heightMax);

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
};
export default Level;
