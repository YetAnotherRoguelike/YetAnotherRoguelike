import { Queue } from "@kxirk/adt";
import { fromJSON, toJSON } from "@kxirk/serialize";

import { Level } from "@yetanotherroguelike/class";


/** @type {Queue<Level>} */ const levels = new Queue();
export default levels;


Object.defineProperty(levels, "fromJSON", {
  /**
   * @param {Object[]} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  value (json, reviver) {
    this.clear();

    this.add(...fromJSON(json, [], undefined, (reviver ?? { value: Level.fromJSON })));

    return this;
  },
  enumerable: false
});

Object.defineProperty(levels, "toJSON", {
  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object[]}
   */
  value (key, replacer) {
    return toJSON([...this], undefined, replacer);
  },
  enumerable: false
});
