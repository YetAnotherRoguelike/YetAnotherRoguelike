import { Matrix } from "@kxirk/adt";
import { fromJSON, toJSON, serializable } from "@kxirk/serialize";
import "@kxirk/utils/array.js";
import "@kxirk/utils/number.js";

import Point from "./point.js";
import Tile from "./tile.js";


/**
 * @abstract
 * @extends Matrix<Tile>
 */
const Room = class extends Matrix {
  // #region Instance
  /** @type {Point} */ #center;


  /**
   * @param {number} height
   * @param {number} width
   */
  constructor (height, width) {
    super(height, width);

    this.#center = new Point(Math.floor(width / 2), Math.floor(height / 2));
  }
  // #endregion

  // #region Instance Accessors
  /** @type {Point} */
  get center () { return this.#center; }
  // #endregion

  // #region Instance Derived Properties
  /** @type {number} */
  get area () {
    return (this.height * this.width);
  }
  // #endregion


  // #region Serialize
  /** @type {string[]} */ static parameters = ["height", "width"];


  /**
   * @param {Object[][]} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  fromJSON (json, reviver) {
    super.fromJSON(json, (reviver ?? { value: { value: Tile.fromJSON } }));

    fromJSON(json, this, "center", reviver?.center);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object[][]}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);
    json.constructor = toJSON(this, "constructor", replacer?.constructor);
    json.height = toJSON(this, "height", replacer?.height);
    json.width = toJSON(this, "width", replacer?.width);

    json.center = toJSON(this, "center", replacer?.center);

    return json;
  }
  // #endregion
};
export default serializable(Room, true);
