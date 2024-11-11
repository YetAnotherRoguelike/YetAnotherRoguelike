import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/number.js";

import Entity from "./entity.js";
import Decoration from "./decoration.js";
import Item from "./item.js";
import Mob from "./mob.js";
import Point from "./point.js";


/** @abstract */
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

  /** @type {Set<Mob>} */
  #mobs;
  /** @type {Set<Item>} */
  #items;
  /** @type {Set<Decoration>} */
  #decorations;


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
    this.#decorations = new Set();
  }

  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Tile}
   */
  static fromJSON (json, reviver) {
    return new Tile[json.constructor]().fromJSON(json, reviver);
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {string}
   */
  static toJSON (key, replacer) {
    return toJSON(this, "name", replacer?.name);
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


  /** @type {Set<Mob>} */
  get mobs () { return this.#mobs; }

  /** @type {Set<Item>} */
  get items () { return this.#items; }

  /** @type {Set<Decoration>} */
  get decorations () { return (this.masked ? this.#mask.decorations : this.#decorations); }

  /** @type {number} */
  get occupancy () {
    const volume = this.volume + [
      ...this.decorations.values(),
      ...this.items.values(),
      ...this.mobs.values()
    ].reduce((total, entity) => (total + entity.volume), 0);

    return (volume / 5);
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Tile}
   */
  fromJSON (json, reviver) {
    super.fromJSON(json, reviver);

    fromJSON(json, this, "at", reviver?.at);

    this.masked = fromJSON(json, this, "masked", reviver?.masked);
    this.mask = fromJSON(json, this, "mask", reviver?.mask);

    this.destructible = fromJSON(json, this, "destructible", reviver?.destructible);
    this.transparent = fromJSON(json, this, "transparent", reviver?.transparent);
    this.walkable = fromJSON(json, this, "walkable", reviver?.walkable);

    fromJSON(json, this, "mobs", (reviver?.mobs ?? { value: Mob.fromJSON }));
    fromJSON(json, this, "items", (reviver?.items ?? { value: Item.fromJSON }));
    fromJSON(json, this, "decorations", (reviver?.decorations ?? { value: Decoration.fromJSON }));

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = super.toJSON(key, replacer);

    json.at = toJSON(this, "at", replacer?.at);

    json.masked = toJSON(this, "masked", replacer?.mask);
    json.mask = toJSON(this, "mask", replacer?.masked);

    json.destructible = toJSON(this, "destructible", replacer?.destructible);
    json.transparent = toJSON(this, "transparent", replacer?.transparent);
    json.walkable = toJSON(this, "walkable", replacer?.walkable);

    json.mobs = toJSON(this, "mobs", replacer?.mobs);
    json.items = toJSON(this, "items", replacer?.items);
    json.decorations = toJSON(this, "decorations", replacer?.decorations);

    return json;
  }
};
export default Tile;
