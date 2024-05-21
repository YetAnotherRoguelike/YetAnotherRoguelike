import "@kxirk/utils/array.js";
import "@kxirk/utils/number.js";
import { Condition, Effect, Point } from "@yetanotherroguelike/class";

import { pointDistance, pointLine, pointsAdjacent, pointsEqual } from "./point.js";
import { tileAt, tileDistance } from "./tile.js";
import { line } from "./fov.js";


/**
 * @param {Tile[][][]} depths
 * @param {Mob} user
 * @param {Action} action
 * @param {Entity|Point} target
 * @returns {Entity[]}
 */
export const act = (depths, user, action, target) => {
  const targets = [];
  const hit = [];

  const origin = (target instanceof Point ? target : user.at);
  const offset = (target instanceof Point ? 0 : user.reach);
  const distanceTarget = tileDistance(user.at, target.at ?? target);

  const distanceFactor = action.range / (distanceTarget - offset).clamp(0);
  if (distanceFactor >= 1.0) {
    if (action.radius > 0) {
      const points = pointsAdjacent(target, action.radius);
      const tiles = points.map((point) => tileAt(depths[target.z], point));
      const mobs = []; for (const tile of tiles) mobs.push( ...tile.mobs.values() );

      targets.push(...tiles, ...mobs);
    }
    else targets.push(target);
  }
  else return hit;


  const userBefore = action.userBefore.keysGreater(Math.random());
  for (const effect of userBefore) {
    if (effect instanceof Effect) user.effect(effect);
    if (effect instanceof Condition) user.conditions.add(effect);
  }

  for (const entity of targets) {
    const distance = tileDistance(origin, entity.at);
    const accuracy = action.accuracy(distance - offset);

    const speedFactor = action.speed / (action.speed + (entity.stat?.evade ?? 0));
    const evadeFactor = (1 - speedFactor) / accuracy;
    if (Math.random() <= evadeFactor) continue;

    hit.push(entity);


    // critical
    const proc = Math.random();

    const targetEffects = action.target.keysGreater(proc);
    for (const effect of targetEffects) {
      if (effect instanceof Effect && entity.effect) entity.effect(effect);
      if (effect instanceof Condition && entity.conditions) entity.conditions.add(effect);
    }

    const userEffects = action.user.keysGreater(proc);
    for (const effect of userEffects) {
      if (effect instanceof Effect) user.effect(effect);
      if (effect instanceof Condition) user.conditions.add(effect);
    }
  }

  const userAfter = action.userAfter.keysGreater(Math.random());
  for (const effect of userAfter) {
    if (effect instanceof Effect) user.effect(effect);
    if (effect instanceof Condition) user.conditions.add(effect);
  }


  return hit;
};

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

  if (pointDistance(mob.at, point) === 1) {
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
