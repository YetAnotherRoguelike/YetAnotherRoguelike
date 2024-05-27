import "@kxirk/utils/number.js";

import Entity from "./entity.js";
import Equip from "./equip.js";


const Item = class extends Entity {
  /** @type {Equip} */
  #equip;
  /** @type {number} */
  #stack;

  constructor () {
    super();
    this.display.push("item");

    this.equip = Equip.item;
    this.stack = 1;
  }

  /**
   * @param {Object} json
   * @returns {Item}
   */
  static fromJSON (json) {
    return new Item().fromJSON(json);
  }


  /** @type {Equip} */
  get equip () { return this.#equip; }
  set equip (equip) { this.#equip = equip; }

  /** @type {number} */
  get stack () { return this.#stack; }
  set stack (size) {
    this.#stack = size.clamp(1);
  }


  /**
   * @param {Object} json
   * @returns {Item}
   */
  fromJSON (json) {
    super.fromJSON(json);

    this.equip = json.equip;
    this.stack = json.stack;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    const json = super.toJSON();

    json.equip = this.equip;
    json.stack = this.stack;

    return json;
  }
};
export default Item;
