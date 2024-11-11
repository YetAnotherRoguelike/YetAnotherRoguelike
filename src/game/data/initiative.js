import { PriorityQueue } from "@kxirk/adt";
import { fromJSON, toJSON } from "@kxirk/serialize";

import { Mob } from "@yetanotherroguelike/class";


/** @type {PriorityQueue<Mob>} */
const initiative = new PriorityQueue((a, b) => ((a.stat.energy + a.stat.energyOverflow) > (b.stat.energy + b.stat.energyOverflow)));
export default initiative;

Object.defineProperty(initiative, "fromJSON", {
  /**
   * @param {Object[]} json
   * @param {Function} [reviver]
   * @returns {PriorityQueue<Mob>}
   */
  value (json, reviver) {
    initiative.clear();

    initiative.add(...fromJSON(json, [], undefined, (reviver ?? { value: Mob.fromJSON })));

    return initiative;
  },
  enumerable: false
});

Object.defineProperty(initiative, "toJSON", {
  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object[]}
   */
  value (key, replacer) {
    const json = toJSON([...initiative], undefined, replacer);

    return json;
  },
  enumerable: false
});
