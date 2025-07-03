import { fromJSON, toJSON } from "@kxirk/serialize";


const Point = class {
  // #region Instance
  /** @type {number} */ #x;
  /** @type {number} */ #y;
  /** @type {number} */ #z;


  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor (x, y, z) {
    this.set(x, y, z);
  }
  // #endregion

  // #region Instance Accessors
  /** @type {number} */
  get x () { return this.#x; }
  set x (x) { this.#x = x; }

  /** @type {number} */
  get y () { return this.#y; }
  set y (y) { this.#y = y; }

  /** @type {number} */
  get z () { return this.#z; }
  set z (z) { this.#z = z; }
  // #endregion

  // #region Instance Methods
  /**
   * @param {?number} x
   * @param {?number} y
   * @param {?number} z
   * @returns {this}
   */
  set (x, y, z) {
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.z = z ?? this.z;

    return this;
  }


  /**
   * @returns {Iterator<number>}
   */
  * [Symbol.iterator] () {
    yield this.x;
    yield this.y;
    yield this.z;
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
    this.x = fromJSON(json, this, "x", reviver?.x);
    this.y = fromJSON(json, this, "y", reviver?.y);
    this.z = fromJSON(json, this, "z", reviver?.z);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.x = toJSON(this, "x", replacer?.x);
    json.y = toJSON(this, "y", replacer?.y);
    json.z = toJSON(this, "z", replacer?.z);

    return json;
  }
  // #endregion
};
export default Point;
