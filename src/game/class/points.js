import Point from "./point.js";


const Points = class {
  /** @type {Map<number, Map<number, Map<number, Point>>>} */
  #contents;
  /** @type {Set<Point>} */
  #order;

  /**
   * @param {Iterable} [points]
   * @param {boolean} [ordered]
   */
  constructor (points = [], ordered = false) {
    this.#contents = new Map();
    if (ordered) this.#order = new Set();

    for (const point of points) {
      this.add(...point);
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Point | undefined}
   */
  get (x, y, z) {
    return this.#contents.get(z)?.get(y)?.get(x);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {boolean}
   */
  has (x, y, z) {
    return this.get(x, y, z) !== undefined;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Points}
   */
  add (x, y, z) {
    if (!this.#contents.has(z)) this.#contents.set(z, new Map());
    if (!this.#contents.get(z).has(y)) this.#contents.get(z).set(y, new Map());

    if (!this.#contents.get(z).get(y).has(x)) {
      const point = new Point(x, y, z);
      this.#contents.get(z).get(y).set(x, point);
      this.#order?.add(point);
    }

    return this;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {boolean}
   */
  delete (x, y, z) {
    const point = this.#contents.get(z)?.get(y)?.get(x);

    if (point !== undefined) {
      return this.#contents.get(z).get(y).delete(x) && this.#order.delete(point);
    }
    return false;
  }

  clear () {
    this.#contents.clear();
    this.#order?.clear();
  }

  /**
   * @returns {Point[]}
   */
  values () {
    return this.#order?.values() ?? [...this.#contents.values()].flatMap((depth) => [...depth.values()].flatMap((row) => [...row.values()]));
  }

  /**
   * @returns {number}
   */
  get size () {
    return this.values().length;
  }


  /** @type {Iterator<Point>} */
  [Symbol.iterator] () {
    return this.values()[Symbol.iterator]();
  }
};
export default Points;
