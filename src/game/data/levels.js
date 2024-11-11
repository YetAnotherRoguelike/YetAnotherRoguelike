import { Queue } from "@kxirk/adt";
import { fromJSON, toJSON } from "@kxirk/serialize";

import { Level } from "@yetanotherroguelike/class";


/** @type {Queue<Level>} */
const levels = new Queue();
export default levels;

Object.defineProperty(levels, "fromJSON", {
  /**
   * @param {Object[]} json
   * @param {Function} [reviver]
   * @returns {Queue<Level>}
   */
  value (json, reviver) {
    levels.clear();

    levels.add(...fromJSON(json, [], undefined, (reviver ?? { value: Level.fromJSON })));

    return levels;
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
    const json = toJSON([...levels], undefined, replacer);

    return json;
  },
  enumerable: false
});
