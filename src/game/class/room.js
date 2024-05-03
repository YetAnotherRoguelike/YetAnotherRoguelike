import "@kxirk/utils/array.js";
import "@kxirk/utils/number.js";
import { Matrix } from "@kxirk/adt";

import Point from "./point.js";
import Tile from "./tile.js";


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
   * @returns {Room}
   */
  static fromJSON (json) {
    return new Room().fromJSON(json);
  }


  /** @type {number} */
  get area () { return (this.height * this.width); }

  /** @type {Point} */
  get center () { return this.#center; }


  /**
   * @param {Object[][]} json
   * @returns {Room}
   */
  fromJSON (json) {
    this.write(...json.map((row) => row.map( (tile) => Tile.fromJSON(tile) )));

    this.center.fromJSON(json.center);

    return this;
  }

  /** @returns {Object[][]} */
  toJSON () {
    const json = this.map((row) => row.map( (tile) => tile.toJSON() ));

    json.center = this.center.toJSON();

    return json;
  }
};
export default Room;
