import "@kxirk/utils/number.js";
import { fromJSON, toJSON } from "@kxirk/serialize";

import { Shape } from "@yetanotherroguelike/class";


/** @abstract */
const AOE = class extends Shape {
  /** @type {boolean} */
  #collide;

  /** @type {boolean} */
  #mobs;
  /** @type {boolean} */
  #tiles;

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


  /** @type {boolean} */
  get collide () { return this.#collide; }
  set collide (collide) { this.#collide = collide; }


  /** @type {boolean} */
  get mobs () { return this.#mobs; }
  set mobs (mobs) { this.#mobs = mobs; }

  /** @type {boolean} */
  get tiles () { return this.#tiles; }
  set tiles (tiles) { this.#tiles = tiles; }


  /**
   * @abstract
   * @param {Point} origin
   * @param {Point} target
   * @param {number} offset
   * @return {Point[]}
   */
  points (origin, target, offset) {
    return [];
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {AOE}
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
};
export default AOE;
