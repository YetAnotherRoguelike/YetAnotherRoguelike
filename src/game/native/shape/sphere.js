import "@kxirk/utils/number.js";

import { Shape, Tile } from "@yetanotherroguelike/class";

import AOE from "./aoe.js";
import { pointsAdjacent } from "../world/point.js";
import { tilesExist, tilesFill } from "../world/tile.js";


const Sphere = class extends AOE {
  /** @type {number} */
  #radius;

  /**
   * @param {number} range
   * @param {number} decay
   * @param {number} radius
   */
  constructor (range, decay, radius) {
    super(range, decay);

    this.radius = radius;
  }


  /** @type {number} */
  get radius () { return this.#radius; }
  set radius (radius) {
    this.#radius = radius.clamp(0);
  }


  /**
   * @override
   * @param {Point} origin
   * @param {Point} target
   * @param {number} offset
   * @return {Point[]}
   */
  points (origin, target, offset) {
    let points = tilesExist(pointsAdjacent(target, this.radius));

    if (this.collide) {
      points = tilesFill(target, Tile.walkable, points);
    }

    return points;
  }
};
Shape.Sphere = Sphere;
export default Sphere;
