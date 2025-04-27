import "@kxirk/utils/number.js";
import { fromJSON, toJSON } from "@kxirk/serialize";

import { Shape } from "@yetanotherroguelike/class";


/** @abstract */
const AOE = class extends Shape {
  /** @type {boolean} */
  #mobs;
  /** @type {boolean} */
  #tiles;

  /** @type {number} */
  #range;
  /** @type {boolean} */
  #collide;

  /**
   * @param {number} range
   */
  constructor (range) {
    super();

    this.mobs = true;
    this.tiles = true;

    this.range = range;
    this.collide = true;
  }


  /** @type {boolean} */
  get mobs () { return this.#mobs; }
  set mobs (mobs) { this.#mobs = mobs; }

  /** @type {boolean} */
  get tiles () { return this.#tiles; }
  set tiles (tiles) { this.#tiles = tiles; }


  /** @type {number} */
  get range () { return this.#range; }
  set range (range) {
    this.#range = range.clamp(0);
  }

  /** @type {boolean} */
  get collide () { return this.#collide; }
  set collide (collide) { this.#collide = collide; }


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

    this.mobs = fromJSON(json, this, "mobs", reviver?.mobs);
    this.tiles = fromJSON(json, this, "tiles", reviver?.tiles);

    this.range = fromJSON(json, this, "range", reviver?.range);
    this.collide = fromJSON(json, this, "collide", reviver?.collide);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    json.mobs = toJSON(this, "mobs", replacer?.mobs);
    json.tiles = toJSON(this, "tiles", replacer?.tiles);

    json.range = toJSON(this, "range", replacer?.range);
    json.collide = toJSON(this, "collide", replacer?.collide);

    return json;
  }
};
export default AOE;
