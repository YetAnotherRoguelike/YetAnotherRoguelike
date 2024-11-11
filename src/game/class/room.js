import { Matrix } from "@kxirk/adt";
import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/array.js";
import "@kxirk/utils/number.js";

import Point from "./point.js";
import Tile from "./tile.js";


/** @abstract */
const Room = class extends Matrix /* <Tile> */ {
  /** @type {Point} */
  #center;

  /**
   * @param {number} height
   * @param {number} width
   */
  constructor (height, width) {
    super(height, width);

    this.#center = new Point(Math.floor(width / 2), Math.floor(height / 2));
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Room}
   */
  static fromJSON (json, reviver) {
    return new Room[json.constructor](json.height, json.width).fromJSON(json, reviver);
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
  get area () { return (this.height * this.width); }

  /** @type {Point} */
  get center () { return this.#center; }


  /**
   * @param {Object[][]} json
   * @param {Function} [reviver]
   * @returns {Room}
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
};
export default Room;
