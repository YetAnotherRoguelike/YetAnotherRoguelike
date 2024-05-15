import { Point } from "@yetanotherroguelike/class";

import { pointDistance, pointLine, pointsEqual } from "./point.js";
import { tileAt } from "./tile.js";
import { line } from "./fov.js";


/**
 * @param {Tile[][][]} depths
 * @param {Mob} mob
 * @param {Point} point
 * @returns {boolean}
 */
export const look = (depths, mob, point) => {
  const depth = depths[mob.at.z];

  const los = line(depth, mob.at, point, { transparent: true }, true);
  const facing = los[1] ?? new Point(mob.at.x + 1, mob.at.y, mob.at.z);
  const last = los.last;

  mob.facing.set(...facing);
  mob.looking.set(...last);

  if ( pointsEqual(last, point) ) return true;
  return false;
};

/**
 * @param {Tile[][][]} depths
 * @param {Mob} mob
 * @param {Point} point
 * @returns {boolean}
 */
export const move = (depths, mob, point) => {
  const z = mob.at.z; point.z = z;
  const depth = depths[z];

  const relative = new Point((point.x - mob.at.x), (point.y - mob.at.y), (point.z - mob.at.z));
  const distance = pointDistance(mob.at, point);

  if (distance === 1) {
    const prev = tileAt(depth, mob.at);
    const tile = tileAt(depth, point);

    if (tile.walkable && tile.occupancy < 1.0) {
      prev.mobs.delete(mob);

      tile.mobs.add(mob);
      mob.at.set(...point);

      const los = pointLine(mob.at, mob.looking);
      const facing = los[1] ?? new Point((mob.at.x + relative.x), (mob.at.y + relative.y));
      mob.facing.set(...facing);

      return true;
    }
  }

  return false;
};

/**
 * @param {Tile[][][]} depths
 * @param {Mob} mob
 * @param {Point} at
 * @param {Point} looking
 * @returns {boolean}
 */
export const place = (depths, mob, at, looking) => {
  depths[at.z][at.y][at.x].mobs.add(mob);

  mob.at.set(...at);
  look(depths, mob, looking);

  return true;
};
