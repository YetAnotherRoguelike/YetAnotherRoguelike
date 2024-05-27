import "@kxirk/utils/array.js";
import "@kxirk/utils/number.js";

import Size from "./size.js";


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

  /**
   * @param {Object} json
   * @returns {Entity}
   */
  static fromJSON (json) {
    return new Entity().fromJSON(json);
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
   * @returns {Entity}
   */
  fromJSON (json) {
    this.name = json.name;
    this.description = json.description;

    this.display.write(...json.display);
    this.color = json.color;

    this.length = json.length;
    this.width = json.width;
    this.height = json.height;
    this.volumeFactor = json.volumeFactor;

    this.density = json.density;

    return this;
  }

  /** @returns {Object} */
  toJSON () {
    return {
      name: this.name,
      description: this.description,

      display: this.display,
      color: this.color,

      length: this.length,
      width: this.width,
      height: this.height,
      volumeFactor: this.volumeFactor,

      density: this.density
    };
  }
};
export default Entity;
