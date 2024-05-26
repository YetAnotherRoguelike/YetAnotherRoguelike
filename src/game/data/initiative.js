import { PriorityQueue } from "@kxirk/adt";
import { Mob } from "@yetanotherroguelike/class";


/** @type {PriorityQueue.<Mob>} */
const initiative = new PriorityQueue((a, b) => (a.stat.speed > b.stat.speed));
export default initiative;

Object.defineProperty(initiative, "fromJSON", {
  /**
   * @param {Object[]} json
   * @returns {PriorityQueue.<Mob>}
   */
  value (json) {
    initiative.add(...json.map( (mob) => Mob.fromJSON(mob) ));

    return initiative;
  },
  enumerable: false
});

Object.defineProperty(initiative, "toJSON", {
  /** @returns {Object[]} */
  value () {
    return initiative.map( (mob) => mob.toJSON() );
  },
  enumerable: false
});
