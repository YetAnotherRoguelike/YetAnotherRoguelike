import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import { Shape, Tile } from "@yetanotherroguelike/class";

import AOE from "./aoe.js";
import { fov } from "../world/fov.js";
import { tilesExist } from "../world/tile.js";


/**
 * @extends AOE
 */
const Cone = class extends AOE {
  // #region Instance
  /** @type {number} */ #angle;


  /**
   * @param {number} range
   * @param {number} decay
   * @param {number} [angle]
   */
  constructor (range, decay, angle = 60) {
    super(range, decay);

    this.angle = angle;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {number} */
  get angle () { return this.#angle; }
  set angle (angle) {
    this.#angle = angle.clamp(0, 360);
  }
  // #endregion

  // #region Instance Methods
  /**
   * @param {Point} origin
   * @param {Point} target
   * @return {Point[]}
   */
  points (origin, target) {
    const points = tilesExist(fov(origin, target, this.range, this.angle, (this.collide ? Tile.walkable : {}), true));

    return points;
  }
  // #endregion


  // #region Serialize
  /** @type {string} */ static name = "Cone";
  /** @type {string[]} */ static parameters = ["range", "decay", "angle"];


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    super.fromJSON(json, reviver);

    this.angle = fromJSON(json, this, "angle", reviver?.angle);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    json.angle = toJSON(this, "angle", replacer?.angle);

    return json;
  }
  // #endregion
};
export default Cone;

Shape.register(Cone);
