import "@kxirk/utils/number.js";

import Entity from "./entity.js";
import Item from "./item.js";
import Mob from "./mob.js";
import Point from "./point.js";


const Tile = class extends Entity {
  /** @type {Point} */
  #at;

  /** @type {boolean} */
  #masked;
  /** @type {Tile} */
  #mask;

  /** @type {boolean} */
  #destructible;
  /** @type {boolean} */
  #transparent;
  /** @type {boolean} */
  #walkable;

  /** @type {Set.<Mob>} */
  #mobs;
  /** @type {Set.<Item>} */
  #items;


  constructor () {
    super();
    this.display.push("tile");

    this.length = 5;
    this.width = 5;
    this.height = 10;

    this.#at = new Point();

    this.masked = false;
    this.mask = null;

    this.destructible = false;
    this.transparent = false;
    this.walkable = false;

    this.#mobs = new Set();
    this.#items = new Set();
  }

  /**
   * @param {Object} json
   * @returns {Tile}
   */
  static fromJSON (json) {
    return new Tile().fromJSON(json);
  }


  /** @type {string} */
  get name () { return (this.masked ? this.#mask.name : super.name); }
  set name (name) { super.name = name; }

  /** @type {string} */
  get description () { return (this.masked ? this.#mask.description : super.description); }
  set description (description) { super.description = description; }


  /** @type {string[]} */
  get display () { return (this.masked ? this.#mask.display : super.display); }

  /** @type {keyof Color} */
  get color () { return (this.masked ? this.#mask.color : super.color); }
  set color (color) { super.color = color; }


  /** @type {number} */
  get length () { return (this.masked ? this.#mask.length : super.length); }
  set length (length) { super.length = length; }

  /** @type {number} */
  get width () { return (this.masked ? this.#mask.width : super.width); }
  set width (width) { super.width = width; }

  /** @type {number} */
  get height () { return (this.masked ? this.#mask.height : super.height); }
  set height (height) { super.height = height; }

  /** @type {number} */
  get volumeFactor () { return (this.masked ? this.#mask.volumeFactor : super.volumeFactor); }
  set volumeFactor (factor) { super.volumeFactor = factor; }


  /** @type {number} */
  get density () { return (this.masked ? this.#mask.density : super.density); }
  set density (density) { super.density = density; }


  /** @type {Point} */
  get at () { return this.#at; }


  /** @type {boolean} */
  get masked () { return this.#masked; }
  set masked (masked) { this.#masked = masked; }

  /** @type {Tile} */
  get mask () { return this.#mask; }
  set mask (mask) { this.#mask = mask; }


  /** @type {boolean} */
  get destructible () { return this.#destructible; }
  set destructible (destructible) { this.#destructible = destructible; }

  /** @type {boolean} */
  get transparent () { return (this.masked ? this.#mask.transparent : this.#transparent); }
  set transparent (transparent) { this.#transparent = transparent; }

  /** @type {boolean} */
  get walkable () { return (this.masked ? this.#mask.walkable : this.#walkable); }
  set walkable (walkable) { this.#walkable = walkable; }


  /** @type {Set.<Mob>} */
  get mobs () { return this.#mobs; }

  /** @type {Set.<Item>} */
  get items () { return this.#items; }

  /** @type {number} */
  get occupancy () {
    const volume = this.volume + [
      ...this.items.values(),
      ...this.mobs.values()
    ].reduce((total, entity) => (total + entity.volume), 0);

    return (volume / 5);
  }


  /**
   * @param {Object} json
   * @returns {Tile}
   */
  fromJSON (json) {
    super.fromJSON(json);

    this.at.fromJSON(json.at);

    this.masked = json.masked;
    this.mask = Tile.fromJSON(json.mask);

    this.destructible = json.destructible;
    this.transparent = json.transparent;
    this.walkable = json.walkable;

    for (const mob of json.mobs) this.mobs.add( Mob.fromJSON(mob) );
    for (const item of json.items) this.items.add( Item.fromJSON(item) );

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    const json = super.toJSON();

    json.name = super.name;
    json.description = super.description;

    json.display = super.display;
    json.color = super.color;

    json.length = super.length;
    json.width = super.width;
    json.height = super.height;
    json.volumeFactor = super.volumeFactor;

    json.density = super.density;

    json.at = this.at.toJSON();

    json.masked = this.masked;
    json.mask = this.mask.toJSON();

    json.destructible = this.destructible;
    json.transparent = this.#transparent;
    json.walkable = this.#walkable;

    json.mobs = [...this.mobs].map((mob) => mob.toJSON());
    json.items = [...this.items].map((item) => item.toJSON());

    return json;
  }
};
export default Tile;
