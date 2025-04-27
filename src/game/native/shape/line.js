import { Shape, Tile } from "@yetanotherroguelike/class";

import AOE from "./aoe.js";
import { pointLine } from "../world/point.js";
import { line } from "../world/fov.js";


const Line = class extends AOE {
  /**
   * @override
   * @param {Point} origin
   * @param {Point} target
   * @param {number} offset
   * @return {Point[]}
   */
  points (origin, target, offset) {
    if (this.collide) {
      return line(origin, target, Tile.walkable, true);
    }
    return pointLine(origin, target, true);
  }
};
Shape.Line = Line;
export default Line;
