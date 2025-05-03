import { Shape, Tile } from "@yetanotherroguelike/class";

import AOE from "./aoe.js";
import { tilesExist } from "../world/tile.js";
import { fov } from "../world/fov.js";


const Cone = class extends AOE {
  /** @type {number} */
  #angle;

  /**
   * @param {number} range
   * @param {number} decay
   * @param {number} [angle]
   */
  constructor (range, decay, angle = 60) {
    super(range, decay);

    this.angle = angle;
  }


  /** @type {number} */
  get angle () { return this.#angle; }
  set angle (angle) {
    this.#angle = angle.clamp(0, 360);
  }


  /**
   * @param {Point} origin
   * @param {Point} target
   * @param {number} offset
   * @return {Point[]}
   */
  points (origin, target, offset) {
    const points = tilesExist(fov(origin, target, this.range, this.angle, (this.collide ? Tile.walkable : {}), true));

    return points;
  }
};
Shape.Cone = Cone;
export default Cone;
