import { toJSON } from "@kxirk/serialize";


const Shape = class {
  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Shape}
   */
  static fromJSON (json, reviver) {
    return new Shape[json.constructor]().fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Shape}
   */
  fromJSON (json, reviver) {
    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};
    json.constructor = toJSON(this, "constructor", replacer?.constructor);

    return json;
  }
};
export default Shape;
