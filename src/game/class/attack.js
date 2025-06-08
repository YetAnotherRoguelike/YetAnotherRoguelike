import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Action from "./action.js";


/** @abstract */
const Attack = class extends Action {
  /** @type {number} */
  #critical; // % chance [0.0, 1.0] to deal additional damage, replaces mob stat critical when not null

  constructor () {
    super();

    this.#critical = null;
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Attack}
   */
  static fromJSON (json, reviver) {
    return new Attack[json.constructor]().fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
  }


  /** @type {number} */
  get critical () { return this.#critical; }
  set critical (critical) {
    this.#critical = (critical === null) ? critical : critical.clamp(0.0);
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Attack}
   */
  fromJSON (json, reviver) {
    super.fromJSON(json, reviver);

    if (json.critical !== undefined) this.critical = fromJSON(json, this, "critical", reviver?.critical);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    if (this.critical !== null) json.critical = toJSON(this, "critical", replacer?.critical);

    return json;
  }
};
export default Attack;
