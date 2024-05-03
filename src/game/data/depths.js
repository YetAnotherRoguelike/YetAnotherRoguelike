import "@kxirk/utils/array.js";
import { Tile } from "@yetanotherroguelike/class";

import levels from "./levels.js";
import random from "./random.js";


/** @type {Function} */
let generate = null;

/** @type {Tile[][][]} */
const depths = [];
export default new Proxy(depths, {
  get: (target, property) => {
    if (property === "generate") {
      return generate;
    }

    const index = Number(property);
    if ( Number.isInteger(index) ) {
      while (index >= target.length) {
        const level = levels.remove();
        const generated = generate(random, level, target.length);

        target.push(...generated);
      }
    }

    return target[property];
  },
  set: (target, property, value) => {
    if (property === "generate") {
      generate = value;
      return generate;
    }

    return false;
  }
});

Object.defineProperty(depths, "fromJSON", {
  /**
   * @param {Object[][][]} json
   * @returns {Tile[][][]}
   */
  value (json) {
    depths.write(...json.map((depth) => depth.map((row) => row.map( (tile) => Tile.from(tile) ))));

    return depths;
  },
  enumerable: false
});

Object.defineProperty(depths, "toJSON", {
  /** @returns {Object[][][]} */
  value () {
    return depths.map((depth) => depth.map((row) => row.map( (tile) => tile.toJSON() )));
  },
  enumerable: false
});
