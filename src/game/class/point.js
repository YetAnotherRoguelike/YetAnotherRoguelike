import { fromJSON, toJSON } from "@kxirk/serialize";


const Point = class {
  /** @type {number} */
  #x;
  /** @type {number} */
  #y;
  /** @type {number} */
  #z;

  /**
   * @param {number} [x]
   * @param {number} [y]
   * @param {number} [z]
   */
  constructor (x = 0, y = 0, z = 0) {
    this.set(x, y, z);
  }


  /** @type {number} */
  get x () { return this.#x; }
  set x (x) { this.#x = x; }

  /** @type {number} */
  get y () { return this.#y; }
  set y (y) { this.#y = y; }

  /** @type {number} */
  get z () { return this.#z; }
  set z (z) { this.#z = z; }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {undefined}
   */
  set (x, y, z) {
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.z = z ?? this.z;
  }

  /** @type {Iterator<number>} */
  [Symbol.iterator] () {
    const array = [this.x, this.y, this.z];

    return array[Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Point}
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
};
export default Point;
