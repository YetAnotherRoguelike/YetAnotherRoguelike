import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import { Shape, Tile } from "@yetanotherroguelike/class";

import AOE from "./aoe.js";
import { pointsAdjacent } from "../world/point.js";
import { tilesExist, tilesFill } from "../world/tile.js";


/**
 * @extends AOE
 */
const Sphere = class extends AOE {
  // #region Instance
  /** @type {number} */ #radius;


  /**
   * @param {number} range
   * @param {number} decay
   * @param {number} radius
   */
  constructor (range, decay, radius) {
    super(range, decay);

    this.radius = radius;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {number} */
  get radius () { return this.#radius; }
  set radius (radius) {
    this.#radius = radius.clamp(0);
  }
  // #endregion

  // #region Instance Methods
  /**
   * @override
   * @param {Point} origin
   * @param {Point} target
   * @return {Point[]}
   */
  points (origin, target) {
    let points = tilesExist(pointsAdjacent(target, this.radius));

    if (this.collide) {
      points = tilesFill(target, Tile.walkable, points);
    }

    return points;
  }
  // #endregion


  // #region Serialize
  /** @type {string} */ static name = "Sphere";
  /** @type {string[]} */ static parameters = ["range", "decay", "radius"];


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    super.fromJSON(json, reviver);

    this.radius = fromJSON(json, this, "radius", reviver?.radius);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    json.radius = toJSON(this, "radius", replacer?.radius);

    return json;
  }
  // #endregion
};
export default Sphere;

Shape.register(Sphere);
