import { Shape, Tile } from "@yetanotherroguelike/class";

import { pointsEqual } from "../world/point.js";
import { tileDistance } from "../world/tile.js";
import { line } from "../world/fov.js";


const Target = class extends Shape {
  // range (ft): self [0, 5), melee [5, 10), ranged 10+

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
};
Shape.Target = Target;
export default Target;
