import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/array.js";
import "@kxirk/utils/number.js";

import Size from "./size.js";


/** @abstract */
const Entity = class {
  /** @type {string} */
  #name;
  /** @type {string} */
  #description;

  /** @type {string[]} */
  #display;
  /** @type {Color} */
  #color;

  /** @type {number} */
  #length; // ft
  /** @type {number} */
  #width; // ft
  /** @type {number} */
  #height; // ft
  /** @type {number} */
  #volumeFactor; // [0.0, 1.0]

  /** @type {number} */
  #density; // lb/ft3

  constructor () {
    this.name = null;
    this.description = null;

    this.#display = [];
    this.color = null;

    this.length = 0;
    this.width = 0;
    this.height = 0;
    this.volumeFactor = 0.0;

    this.density = 0;
  }


  /** @type {string} */
  get name () { return this.#name; }
  set name (name) { this.#name = name; }

  /** @type {string} */
  get description () { return this.#description; }
  set description (description) { this.#description = description; }


  /** @type {string[]} */
  get display () { return this.#display; }

  /** @type {Color} */
  get color () { return this.#color; }
  set color (color) { this.#color = color; }


  /** @type {number} */
  get length () { return this.#length; }
  set length (length) { this.#length = length.round(0.01).clamp(0); }

  /** @type {number} */
  get width () { return this.#width; }
  set width (width) { this.#width = width.round(0.01).clamp(0); }

  /** @type {number} */
  get height () { return this.#height; }
  set height (height) { this.#height = height.round(0.01).clamp(0); }

  /** @type {number} */
  get dimensionMax () {
    return Math.max(this.length, this.#width, this.height);
  }

  /** @type {number} */
  get volumeFactor () { return this.#volumeFactor; }
  set volumeFactor (factor) { this.#volumeFactor = factor.round(0.01).clamp(0.0, 1.0); }

  /** @type {number} */
  get volume () {
    return (this.volumeFactor * this.length * this.width * this.height).round(0.01);
  }

  /** @type {keyof Size} */
  get size () {
    const volumeMax = this.dimensionMax ** 3;

    for (const [size, range] of Object.entries(Size)) {
      if (range.includes(volumeMax)) return size;
    }

    return null;
  }


  /** @type {number} */
  get density () { return this.#density; }
  set density (density) { this.#density = density.round(0.001).clamp(0); }

  /** @type {number} */
  get weight () {
    return (this.density * this.volume).round(0.001);
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Entity}
   */
  fromJSON (json, reviver) {
    this.name = fromJSON(json, this, "name", reviver?.name);
    this.description = fromJSON(json, this, "description", reviver?.description);

    fromJSON(json, this, "display", reviver?.display);
    this.color = fromJSON(json, this, "color", reviver?.color);

    this.length = fromJSON(json, this, "length", reviver?.length);
    this.width = fromJSON(json, this, "width", reviver?.width);
    this.height = fromJSON(json, this, "height", reviver?.height);
    this.volumeFactor = fromJSON(json, this, "volumeFactor", reviver?.volumeFactor);

    this.density = fromJSON(json, this, "density", reviver?.density);

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

    json.name = toJSON(this, "name", replacer?.name);
    json.description = toJSON(this, "description", replacer?.description);

    json.display = toJSON(this, "display", replacer?.display);
    json.color = toJSON(this, "color", replacer?.color);

    json.length = toJSON(this, "length", replacer?.length);
    json.width = toJSON(this, "width", replacer?.width);
    json.height = toJSON(this, "height", replacer?.height);
    json.volumeFactor = toJSON(this, "volumeFactor", replacer?.volumeFactor);

    json.density = toJSON(this, "density", replacer?.density);

    return json;
  }
};
export default Entity;
