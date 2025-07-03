import { Shape, Tile } from "@yetanotherroguelike/class";

import AOE from "./aoe.js";
import { line } from "../world/fov.js";
import { pointsLine } from "../world/point.js";


/**
 * @extends AOE
 */
const Line = class extends AOE {
  // #region Instance Methods
  /**
   * @override
   * @param {Point} origin
   * @param {Point} target
   * @return {Point[]}
   */
  points (origin, target) {
    if (this.collide) {
      return line(origin, target, Tile.walkable, true);
    }
    return pointsLine(origin, target, true);
  }
  // #endregion


  // #region Serialize
  /** @type {string} */ static name = "Line";
  // #endregion
};
export default Line;

Shape.register(Line);
