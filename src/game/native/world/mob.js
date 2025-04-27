import Random from "@kxirk/random";
import "@kxirk/utils/array.js";
import Math from "@kxirk/utils/math.js";
import "@kxirk/utils/number.js";

import { Point, Tick, Tile } from "@yetanotherroguelike/class";
import { depths, initiative } from "@yetanotherroguelike/data";

import { pointDistance, pointHeading, pointsEqual, pointsAdjacent, pointLine } from "./point.js";
import { tileAt, tileDistance, tilesAt, tilesExist } from "./tile.js";
import { line } from "./fov.js";
import Target from "../shape/target.js";


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


  const targets = [];

  if (action.shape instanceof Target) {
    const entities = action.shape.entities(user, target, user.reach);
    targets.push(...entities);
  }
  else {
    const points = action.shape.points(user.at, (target.at ?? target), user.reach);
    if (action.shape.tiles) targets.push(...tilesAt(points));
    if (action.shape.mobs) targets.push(...mobsAt(points));
  }


  const affects = [];

  if (action.userBefore) affects.push([user, applyEffect(user, action.userBefore)]);

  const affectPairs = [];
  for (const entity of targets) {
    const distance = tileDistance(user.at, entity.at);
    const accuracy = action.accuracy(distance - user.reach);

    const speedFactor = action.speed / (action.speed + (entity.stat?.evade ?? 0));
    const evadeFactor = (1 - speedFactor) / accuracy;

    const occupancies = tilesAt(tilesExist(pointsAdjacent(entity.at, Math.SQRT2, true))).map((tile) => tile.occupancy.clamp(0, 1));
    const moveFactor = 1 - Math.average(...occupancies);

    if (Random.shared.next() <= (evadeFactor * moveFactor)) continue;


    let effectTarget;
    let effectUser;
    let critical = false;
    if (Random.shared.next() <= (action.critical ?? user.stat.critical)) {
      effectTarget = action.target?.critical;
      effectUser = action.user?.critical;
      critical = true;
    }
    effectTarget ??= action.target;
    effectUser ??= action.user;

    const affectTarget = applyEffect(entity, effectTarget);
    if (affectTarget) {
      let affectUser;
      if (action.user) {
        affectUser = applyEffect(user, (effectUser instanceof Function ? effectUser(affectTarget, critical) : effectUser));
        affects.push([user, affectUser]);
      }

      affectPairs.push([affectTarget, affectUser, critical]);
    }

    entity.turn?.push(action);
    affects.push([entity, affectTarget]);
  }

  const effectAfter = action.userAfter;
  if (effectAfter) affects.push([user, applyEffect(user, (effectAfter instanceof Function ? effectAfter(affectPairs) : effectAfter))]);

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

    if (tile.walkable && tile.occupancy < 1.0) {
      prev.mobs.delete(mob);

      tile.mobs.add(mob);
      mob.at.set(...point);

      const los = pointLine(mob.at, mob.looking, true);
      const facing = los.first ?? new Point((mob.at.x + direction.x), (mob.at.y + direction.y), (mob.at.z + direction.z));
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
 * @returns {boolean}
 */
export const place = (mob, at, looking) => {
  depths[at.z][at.y][at.x].mobs.add(mob);

  mob.at.set(...at);
  look(mob, looking);

  return true;
};


export const tick = async () => {
  const actor = initiative.remove();
  actor.vital.energyOverflow = 0;
  actor.turn.clear();
  actor.tick(Tick.before);

  const energy = await actor.act(actor);
  const energyMax = Math.max(...[...initiative].map((mob) => mob.stat.energyMax));
  for (const mob of initiative) {
    const delta = ((mob.stat.energyMax / energyMax) * energy);
    mob.vital.energy += delta;
  }

  actor.tick(Tick.after);
  initiative.add(actor);
};
