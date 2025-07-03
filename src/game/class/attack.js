import { fromJSON, toJSON, serializable } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Action from "./action.js";


/**
 * @abstract
 * @extends Action
 */
const Attack = class extends Action {
  // #region Instance
  /** @type {?number} */ #critical; // % chance [0.0, 1.0] to deal additional damage, replaces mob.stat.critical when not null


  constructor () {
    super();

    this.#critical = null;
  }
  // #endregion

  // #region Instance Accessors
  /** @type {number} */
  get critical () { return this.#critical; }
  set critical (critical) {
    this.#critical = ((critical === null) ? critical : critical.clamp(0.0));
  }
  // #endregion


  // #region Serialize
  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    super.fromJSON(json, reviver);

    this.critical = fromJSON(json, this, "critical", reviver?.critical);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    json.critical = toJSON(this, "critical", replacer?.critical);

    return json;
  }
  // #endregion
};
export default serializable(Attack, true);
