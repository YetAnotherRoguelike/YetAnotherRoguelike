import { PriorityQueue } from "@kxirk/adt";
import { fromJSON, toJSON } from "@kxirk/serialize";

import { Mob } from "@yetanotherroguelike/class";


/** @type {PriorityQueue<Mob>} */ const initiative = new PriorityQueue((a, b) => ((a.vital.energy + a.vital.energyOverflow) > (b.vital.energy + b.vital.energyOverflow)));
export default initiative;

Object.defineProperty(initiative, "max", {
  /** @type {number} */
  get () {
    return Math.max(...[...this].map((mob) => mob.stat.energyMax));
  },
  enumerable: false
});


Object.defineProperty(initiative, "fromJSON", {
  /**
   * @param {Object[]} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  value (json, reviver) {
    this.clear();

    this.add(...fromJSON(json, [], undefined, (reviver ?? { value: Mob.fromJSON })));

    return this;
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
    return toJSON([...this], undefined, replacer);
  },
  enumerable: false
});
