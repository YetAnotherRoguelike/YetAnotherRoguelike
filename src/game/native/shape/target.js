import "@kxirk/utils/number.js";
import { fromJSON, toJSON } from "@kxirk/serialize";

import { Shape, Tile } from "@yetanotherroguelike/class";

import { pointsEqual } from "../world/point.js";
import { tileDistance } from "../world/tile.js";
import { line } from "../world/fov.js";


const Target = class extends Shape {
  /** @type {number} */
  #range; // ft: self [0, 5), melee [5, 10), ranged 10+

  /**
   * @param {number} range
   */
  constructor (range) {
    super();

    this.range = range;
  }


  /** @type {number} */
  get range () { return this.#range; }
  set range (range) {
    this.#range = range.clamp(0);
  }


  /**
   * @param {Entity} user
   * @param {Entity} target
   * @param {number} offset
   * @return {Entity[]}
   */
  entities (user, target, offset) {
    const entities = [];

    const distance = tileDistance(user.at, target.at);
    if ((distance - offset) > this.range) return entities;

    if (distance >= 10) {
      const los = line(user.at, target.at, Tile.walkable, true);
      const last = los.last;

      if (!pointsEqual(target.at, last)) return entities;
    }

    entities.push(target);

    return entities;
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Target}
   */
  fromJSON (json, reviver) {
    super.fromJSON(json, reviver);

    this.range = fromJSON(json, this, "range", reviver?.range);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    json.range = toJSON(this, "range", replacer?.range);

    return json;
  }
};
Shape.Target = Target;
export default Target;
