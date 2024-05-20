import { Room } from "@yetanotherroguelike/class";
import { depths } from "@yetanotherroguelike/data";

import Floor from "../tile/floor.js";
import Wall from "../tile/wall.js";


/**
 * @param {Random} random
 * @param {Level} level
 * @param {number} depthBase
 * @param {number} depthLevel
 * @returns {Depth}
 */
export const generateDepth = (random, level, depthBase, depthLevel) => {
  const depthFactor = Math.log(depthBase + depthLevel + 1);

  const width = ((3 * depthFactor) + 45).round().clamp(level.widthMin, level.widthMax);
  const height = ((2 * depthFactor) + 30).round().clamp(level.heightMin, level.heightMax);

  /** @type {Room} */
  const depth = new Room(height, width);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      depth[y][x] = new Floor();
    }
  }

  for (let y = 0; y < height; y++) {
    depth[y][0] = new Wall();
    depth[y][width - 1] = new Wall();
  }
  for (let x = 0; x < width; x++) {
    depth[0][x] = new Wall();
    depth[height - 1][x] = new Wall();
  }


  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      depth[y][x].at.set(x, y, depthBase + depthLevel);
    }
  }

  return depth;
};

/**
 * @param {Random} random
 * @param {Level} level
 * @param {number} depth
 * @returns {Depth[]}
 */
export const generateDepths = (random, level, depth) => {
  const generated = [];
  for (let i = 0; i < level.depthCount; i++) {
    generated.push(generateDepth(random, level, depth, i));
  }

  return generated;
};
depths.generate = generateDepths;
