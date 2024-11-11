import { toJSON } from "@kxirk/serialize";

import Entity from "./entity.js";


/** @abstract */
const Decoration = class extends Entity {
  constructor () {
    super();
    this.display.push("decoration");
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Decoration}
   */
  static fromJSON (json, reviver) {
    return new Decoration[json.constructor]().fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
  }
};
export default Decoration;
