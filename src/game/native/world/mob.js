import Random from "@kxirk/random";
import "@kxirk/utils/array.js";
import Math from "@kxirk/utils/math.js";
import "@kxirk/utils/number.js";

import { Mob, Point, Tick, Tile } from "@yetanotherroguelike/class";
import { initiative } from "@yetanotherroguelike/data";

import Target from "../shape/target.js";
import { line } from "./fov.js";
import { pointDistance, pointHeading, pointsEqual, pointsAdjacent, pointsLine } from "./point.js";
import { tileAt, tileDistance, tilesAt, tilesExist, tilesMatch } from "./tile.js";


/**
 * @param {Tile[]} tiles
 * @returns {Mob[]}
 */
export const mobsOn = (tiles) => tiles.flatMap((tile) => [...tile.mobs]);

/**
 * @param {Point[]} points
 * @returns {Mob[]}
 */
export const mobsAt = (points) => mobsOn(tilesAt(points));


/**
 * @param {Entity} entity
 * @param {Effect} effect
 * @returns {Affect}
 */
export const applyEffect = (entity, effect) => {
  if (entity.effect instanceof Function) {
    return entity.effect(effect);
  }

  return null;
};

/**
 * @param {Mob} user
 * @param {Action} action
 * @param {Entity | Point} target
 * @returns {[Entity, Affect][]}
 */
export const act = (user, action, target) => {
  user.turn.push(action);
  user.vital.energy -= action.energy;


  let targets = [];

  if (action.shape instanceof Target) {
    const entities = action.shape.entities(user, target, user.reach);
    targets.push(...entities);
  }
  else {
    const points = action.shape.points(user.at, (target.at ?? target), user.reach);
    if (action.shape.tiles) targets.push(...tilesAt(points));
    if (action.shape.mobs) targets.push(...mobsAt(points));
  }

  targets = new Set(targets);


  const affects = [];

  if (action.userBefore) affects.push([user, applyEffect(user, action.userBefore)]);

  const affectPairs = [];
  for (const entity of targets) {
    let evade = 0;
    if (entity instanceof Mob) {
      const occupancies = tilesAt(tilesMatch(tilesExist(pointsAdjacent(entity.at, Math.SQRT2, true)), { walkable: true, not: { has: targets } })).map((tile) => tile.occupancy.clamp(0, 1));
      const occupancyFactor = (1 - Math.average(...occupancies));

      evade = (occupancyFactor * entity.stat.evade);
    }

    const distance = tileDistance(user.at, entity.at);
    const accuracy = action.accuracy((distance - user.reach), action.shape.decay);
    const speedFactor = (action.speed / (evade + action.speed));
    const hit = (speedFactor * accuracy);

    const proc = Random.shared.next();
    if (proc >= hit) continue;


    let effectTarget = action.target;
    let effectUser = action.user;
    let critical = false;
    const criticalThreshold = (action.critical ?? user.stat.critical);
    if ((proc < criticalThreshold) || ((1 - speedFactor) < criticalThreshold)) {
      effectTarget = action.target?.critical;
      effectUser = action.user?.critical;
      critical = true;
    }


    const affectTarget = applyEffect(entity, effectTarget);
    if (affectTarget) {
      let affectUser;
      if (action.user) {
        affectUser = applyEffect(user, ((effectUser instanceof Function) ? effectUser(affectTarget, critical) : effectUser));
        affects.push([user, affectUser]);
      }

      affectPairs.push([affectTarget, affectUser, critical]);
    }

    entity.turn?.push(action);
    affects.push([entity, affectTarget]);
  }

  const effectAfter = action.userAfter;
  if (effectAfter) affects.push([user, applyEffect(user, ((effectAfter instanceof Function) ? effectAfter(affectPairs) : effectAfter))]);

  return affects;
};


/**
 * @param {Mob} mob
 * @param {Point} point
 * @returns {boolean}
 */
export const look = (mob, point) => {
  const los = line(mob.at, point, Tile.transparent, true);
  if (!los.empty) {
    mob.facing.set(...los.first);
    mob.looking.set(...los.last);
  }

  return pointsEqual(mob.looking, point);
};

/**
 * @param {Mob} mob
 * @param {Point} point
 * @returns {boolean}
 */
export const move = (mob, point) => {
  if (pointDistance(mob.at, point) === 1) {
    const direction = pointHeading(mob.at, point);

    const prev = tileAt(mob.at);
    const tile = tileAt(point);
    if (tile.walkable && (tile.occupancy < 1.0)) {
      prev.mobs.delete(mob);

      tile.mobs.add(mob);
      mob.at.set(...point);

      const los = pointsLine(mob.at, mob.looking, true);
      const facing = (los.first ?? new Point((mob.at.x + direction.x), (mob.at.y + direction.y), mob.at.z));
      mob.facing.set(...facing);

      return true;
    }
  }

  return false;
};

/**
 * @param {Mob} mob
 * @param {Point} at
 * @param {Point} looking
 * @param {boolean} [force]
 * @returns {boolean}
 */
export const place = (mob, at, looking, force = false) => {
  const tile = tileAt(at);
  if (force || (tile.walkable && (tile.occupancy < 1.0))) {
    tile.mobs.add(mob);
    mob.at.set(...at);
  }
  else return false;

  look(mob, looking);

  initiative.add(mob);

  return true;
};


export const tick = async () => {
  const actor = initiative.remove();
  actor.vital.energyOverflow = 0;
  actor.turn.clear();
  actor.tick(Tick.before);

  const energy = await actor.act(actor);
  const energyMax = initiative.max;
  for (const mob of initiative) {
    const delta = ((mob.stat.energyMax / energyMax) * energy);
    mob.vital.energy += delta;
  }

  actor.tick(Tick.after);
  initiative.add(actor);
};
