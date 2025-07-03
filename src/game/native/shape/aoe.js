import { fromJSON, toJSON } from "@kxirk/serialize";

import { Shape } from "@yetanotherroguelike/class";


/**
 * @abstract
 * @extends Shape
 */
const AOE = class extends Shape {
  // #region Instance
  /** @type {boolean} */ #collide;

  /** @type {boolean} */ #mobs;
  /** @type {boolean} */ #tiles;


  /**
   * @param {number} range
   * @param {number} decay
   */
  constructor (range, decay) {
    super(range, decay);

    this.#collide = true;

    this.#mobs = true;
    this.#tiles = true;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {boolean} */
  get collide () { return this.#collide; }
  set collide (collide) { this.#collide = collide; }


  /** @type {boolean} */
  get mobs () { return this.#mobs; }
  set mobs (mobs) { this.#mobs = mobs; }

  /** @type {boolean} */
  get tiles () { return this.#tiles; }
  set tiles (tiles) { this.#tiles = tiles; }
  // #endregion

  // #region Instance Methods
  /**
   * @abstract
   * @param {Point} origin
   * @param {Point} target
   * @param {number} offset
   * @returns {Point[]}
  */
  /* eslint-disable-next-line class-methods-use-this, no-unused-vars */ // abstract
  points (origin, target, offset) {
    return [];
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
    super.fromJSON(json, reviver);

    this.collide = fromJSON(json, this, "collide", reviver?.collide);

    this.mobs = fromJSON(json, this, "mobs", reviver?.mobs);
    this.tiles = fromJSON(json, this, "tiles", reviver?.tiles);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    json.collide = toJSON(this, "collide", replacer?.collide);

    json.mobs = toJSON(this, "mobs", replacer?.mobs);
    json.tiles = toJSON(this, "tiles", replacer?.tiles);

    return json;
  }
  // #endregion
};
export default AOE;
