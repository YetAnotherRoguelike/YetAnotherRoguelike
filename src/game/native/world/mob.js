import "@kxirk/utils/array.js";
import Math from "@kxirk/utils/math.js";
import "@kxirk/utils/number.js";
import { Condition, Effect, Point, Tick } from "@yetanotherroguelike/class";

import { pointDistance, pointLine, pointsAdjacent, pointsEqual } from "./point.js";
import { tileAt, tileDistance } from "./tile.js";
import { line } from "./fov.js";


/**
 * @param {Entity} entity
 * @param {FrequencyMap.<Effect|Condition>} effects
 * @param {number} [proc]
 * @returns {Array.<Effect|Condition>}
 */
export const applyEffects = (entity, effects, proc = Math.random()) => {
  const applied = [];

  for (const effect of effects.keysGreater(proc)) {
    if (effect instanceof Effect && entity.effect) {
      entity.effect(effect);

      applied.push(effect);
    }

    if (effect instanceof Condition && entity.conditions) {
      const chance = effects.get(effect);
      const resist = (effect.resistible ? (entity?.stat[`${effect.type}Resist`] ?? 0) : 0) * chance;
      if ((chance - resist) > proc) {
        entity.conditions.add(effect);

        applied.push(effect);
      }
    }
  }

  return applied;
};

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


  applyEffects(user, action.userBefore);

  for (const entity of targets) {
    const distance = tileDistance(origin, entity.at);
    const accuracy = action.accuracy(distance - offset);

    const speedFactor = action.speed / (action.speed + (entity.stat?.evade ?? 0));
    const evadeFactor = (1 - speedFactor) / accuracy;

    const occupancies = pointsAdjacent(entity.at, Math.SQRT2, true).map((point) => tileAt(depths[entity.at.z], point).occupancy.clamp(0, 1));
    const moveFactor = 1 - Math.average(...occupancies);

    if (Math.random() <= (evadeFactor * moveFactor)) continue;
    hit.push(entity);


    // critical
    const proc = Math.random();

    applyEffects(entity, action.target, proc);
    applyEffects(user, action.user, proc);
  }

  applyEffects(user, action.userAfter);


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

/**
 * @param {PriorityQueue.<Mob>} initiative
 * @returns {undefined}
 */
export const tick = async (initiative) => {
  initiative.update();

  const mob = initiative.remove();
  mob.tick(Tick.before);
  mob.stat.energy = mob.stat.energyMax;
  await mob.act(mob);
  mob.tick(Tick.after);

  initiative.add(mob);
};
