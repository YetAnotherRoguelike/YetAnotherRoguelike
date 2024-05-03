import { Queue } from "@kxirk/adt";

import { Level } from "@yetanotherroguelike/class";


/** @type {Queue.<Level>} */
const levels = new Queue();
export default levels;

Object.defineProperty(levels, "fromJSON", {
  /**
   * @param {Object[]} json
   * @returns {Queue.<Level>}
   */
  value (json) {
    levels.add(...json.map( (level) => Level.fromJSON(level) ));

    return levels;
  },
  enumerable: false
});

Object.defineProperty(levels, "toJSON", {
  /** @returns {Object[]} */
  value () {
    return levels.map( (level) => level.toJSON() );
  },
  enumerable: false
});
