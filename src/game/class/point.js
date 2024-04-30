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

  /**
   * @param {Object} json
   * @returns {Point}
   */
  static fromJSON (json) {
    return new Point().fromJSON(json);
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

  /** @type {Function} */
  [Symbol.iterator] () {
    const array = [this.x, this.y, this.z];

    return array[Symbol.iterator]();
  }


  /**
   * @param {Object} json
   * @returns {Point}
   */
  fromJSON (json) {
    this.x = json.x;
    this.y = json.y;
    this.z = json.z;

    return this;
  }

  /** @type {Object} */
  toJSON () {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }
};
export default Point;
