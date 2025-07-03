import "@kxirk/serialize";
import "@kxirk/utils/array.js";

import { Room } from "@yetanotherroguelike/class";

import levels from "./levels.js";


/** @type {Function} */ let generate = null;

/** @type {Tile[][][]} */ const depths = [];
export default new Proxy(depths, {
  get (target, property) {
    if (property === "generate") return generate;

    if (property.constructor === Symbol) return target[property];

    const index = Number(property);
    if (Number.isInteger(index)) {
      while (index >= target.length) {
        const level = levels.remove();
        const generated = generate(level, target.length);

        target.push(...generated);
      }

      return target[index];
    }

    return target[property];
  },
  set (target, property, value) {
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
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  value (json, reviver) {
    for (let i = 0; i < json.length; i++) this[i] = [];

    return Array.prototype.fromJSON.call(this, json, (reviver ?? { value: Room.fromJSON }), false);
  },
  enumerable: false
});
