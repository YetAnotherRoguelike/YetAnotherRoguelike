import Point from "./point.js";


const Points = class {
  // #region Instance
  /** @type {Map<number, Map<number, Map<number, Point>>>} */ #points;
  /** @type {Set<Point>} */ #order;


  /**
   * @param {Iterable} [points]
   * @param {boolean} [ordered]
   */
  constructor (points = [], ordered = false) {
    this.#points = new Map();
    if (ordered) this.#order = new Set();


    for (const point of points) {
      this.add(...point);
    }
  }
  // #endregion

  // #region Instance Methods
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Point | undefined}
   */
  get (x, y, z) {
    return this.#points.get(z)?.get(y)?.get(x);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {boolean}
   */
  has (x, y, z) {
    return (this.get(x, y, z) !== undefined);
  }


  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {this}
   */
  add (x, y, z) {
    if (!this.#points.has(z)) this.#points.set(z, new Map());
    if (!this.#points.get(z).has(y)) this.#points.get(z).set(y, new Map());

    if (!this.#points.get(z).get(y).has(x)) {
      const point = new Point(x, y, z);
      this.#points.get(z).get(y).set(x, point);
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
    const point = this.#points.get(z)?.get(y)?.get(x);

    if (point !== undefined) {
      return (this.#points.get(z).get(y).delete(x) && (this.#order?.delete(point) ?? true));
    }
    return false;
  }

  /**
   * @returns {undefined}
   */
  clear () {
    this.#points.clear();
    this.#order?.clear();
  }


  /**
   * @returns {Point[]}
   */
  values () {
    return (this.#order?.values() ?? this.#points.values().flatMap((z) => z.values().flatMap((y) => y.values()))).toArray();
  }

  /** @type {number} */
  get size () {
    return this.values().length;
  }


  /**
   * @returns {Iterator<Point>}
   */
  [Symbol.iterator] () {
    return this.values()[Symbol.iterator]();
  }
  // #endregion
};
export default Points;
