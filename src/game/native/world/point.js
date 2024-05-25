import "@kxirk/utils/number.js";

import { Point } from "@yetanotherroguelike/class";


/**
 * @param {Point} a
 * @param {Point} b
 * @returns {number}
 */
export const pointDistance = (a, b) => Math.sqrt(Math.abs(a.x - b.x) ** 2 + Math.abs(a.y - b.y) ** 2);

/**
 * @param {Point} start
 * @param {Point} stop
 * @param {boolean} [excludeStart]
 * @returns {Point[]}
 */
export const pointLine = (start, stop, excludeStart = false) => {
  const points = [];

  let x = start.x; const dx = Math.abs(stop.x - x); const sx = ((x < stop.x) ? 1 : -1);
  let y = start.y; const dy = Math.abs(stop.y - y); const sy = ((y < stop.y) ? 1 : -1);

  let error = (dx - dy);
  while (true) {
    points.push( new Point(x, y) );

    if (x === stop.x && y === stop.y) break;

    const e2 = (2 * error);
    if (e2 > -dy) { error -= dy; x += sx; }
    if (e2 < dx) { error += dx; y += sy; }
  }

  if (excludeStart) points.shift();

  return points;
};


/**
 * @param {Point[]} center
 * @param {number} radius
 * @param {boolean} [excludeCenter]
 * @returns {Point[]}
 */
export const pointsAdjacent = (center, radius, excludeCenter = false) => {
  const points = [];

  const r = radius.round();
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (excludeCenter && x === 0 && y === 0) continue;

      const point = new Point((center.x + x), (center.y + y));
      if (pointDistance(center, point) <= radius) points.push(point);
    }
  }

  return points;
};

/**
 * @param {...Point} points
 * @returns {boolean}
 */
export const pointsEqual = (...points) => {
  const { x, y, z } = points.first;

  for (const point of points) {
    if ( (point.x !== x) || (point.y !== y)) return false;
    if ( point?.z && (point.z !== z) ) return false;
  }

  return true;
};
