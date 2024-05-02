import Entity from "./entity.js";
import Point from "./point.js";


const Mob = class extends Entity {
  /** @type {number} */
  #reach; // ft

  /** @type {Point} */
  #at;
  /** @type {Point} */
  #looking;
  /** @type {Point} */
  #facing;

  constructor () {
    super();
    this.display.push("mob");

    this.reach = 0;

    this.#at = new Point();
    this.#looking = new Point();
    this.#facing = new Point();
  }

  /**
   * @param {Object} json
   * @returns {Mob}
   */
  static fromJSON (json) {
    return new Mob().fromJSON(json);
  }


  /** @type {number} */
  get reach () { return this.#reach; }
  set reach (reach) { this.#reach = reach; }


  /** @type {Point} */
  get at () { return this.#at; }

  /** @type {Point} */
  get looking () { return this.#looking; }

  /** @type {Point} */
  get facing () { return this.#facing; }


  /**
   * @param {Object} json
   * @returns {Mob}
   */
  fromJSON (json) {
    super.fromJSON(json);

    this.reach = json.reach;

    this.at.fromJSON(json.at);
    this.looking.fromJSON(json.looking);
    this.facing.fromJSON(json.facing);

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    const json = super.toJSON();

    json.reach = this.reach;

    json.at = this.at.toJSON();
    json.looking = this.looking.toJSON();
    json.facing = this.facing.toJSON();

    return json;
  }
};
export default Mob;
