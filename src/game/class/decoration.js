import { toJSON, serializable } from "@kxirk/serialize";

import Entity from "./entity.js";


/**
 * @abstract
 * @extends Entity
 */
const Decoration = class extends Entity {
  // #region Instance
  constructor () {
    super();
    this.display.push("decoration");
  }
  // #endregion


  // #region Serialize
  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);
    json.constructor = toJSON(this, "constructor", replacer?.constructor);

    return json;
  }
  // #endregion
};
export default serializable(Decoration, true);
