import { Range } from "@kxirk/adt";
import { fromJSON, toJSON } from "@kxirk/serialize";
import "@kxirk/utils/array.js";
import Object from "@kxirk/utils/object.js";


/** @enum {string} */
const Size = class {
  /** @type {string} */
  static tiny = "tiny";
  /** @type {string} */
  static small = "small";
  /** @type {string} */
  static medium = "medium";
  /** @type {string} */
  static large = "large";
  /** @type {string} */
  static giant = "giant";

  /** @type {*} */
  #tiny;
  /** @type {*} */
  #small;
  /** @type {*} */
  #medium;
  /** @type {*} */
  #large;
  /** @type {*} */
  #giant;

  /**
   * @param {*} [initial]
   */
  constructor (initial = null) {
    this.all = initial;

    Object.assignGettersAsEnumerable(this, Size);
  }

  /** @type {Iterator<string>} */
  static* [Symbol.iterator] () {
    yield this.tiny;
    yield this.small;
    yield this.medium;
    yield this.large;
    yield this.giant;
  }


  /** @type {*} */
  get tiny () { return this.#tiny; }
  set tiny (tiny) { this.#tiny = tiny; }

  /** @type {*} */
  get small () { return this.#small; }
  set small (small) { this.#small = small; }

  /** @type {*} */
  get medium () { return this.#medium; }
  set medium (medium) { this.#medium = medium; }

  /** @type {*} */
  get large () { return this.#large; }
  set large (large) { this.#large = large; }

  /** @type {*} */
  get giant () { return this.#giant; }
  set giant (giant) { this.#giant = giant; }

  /** @type {*} */
  set all (value) {
    this.tiny = value;
    this.small = value;
    this.medium = value;
    this.large = value;
    this.giant = value;
  }


  /** @type {Iterator<*>} */
  [Symbol.iterator] () {
    return Size[Symbol.iterator].call(this);
  }


  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @returns {Size}
   */
  fromJSON (json, reviver) {
    this.tiny = fromJSON(json, this, "tiny", reviver?.tiny);
    this.small = fromJSON(json, this, "small", reviver?.small);
    this.medium = fromJSON(json, this, "medium", reviver?.medium);
    this.large = fromJSON(json, this, "large", reviver?.large);
    this.giant = fromJSON(json, this, "giant", reviver?.giant);

    return this;
  }

  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  toJSON (key, replacer) {
    const json = {};

    json.tiny = toJSON(this, "tiny", replacer?.tiny);
    json.small = toJSON(this, "small", replacer?.small);
    json.medium = toJSON(this, "medium", replacer?.medium);
    json.large = toJSON(this, "large", replacer?.large);
    json.giant = toJSON(this, "giant", replacer?.giant);

    return json;
  }
};

/** @type {string[]} */
const sizes = [...Size];
Object.defineProperty(sizes, "indexes", {
  /** @enum {number} */
  value: Object.fromEntries(sizes.map((size, i) => [size, i])),
  enumerable: false
});

export default new Proxy(Size, {
  get (target, property) {
    if (property in sizes) return sizes[property];
    return target[property];
  }
});


/** @type {Size<number>} ft */
export const DimensionMax = new Size();
for (const [size, i] of Object.entries(sizes.indexes)) DimensionMax[size] = 2 ** (i + 1);

/** @type {Size<number>} ft^3 */
export const VolumeMax = new Size();
for (const [size, dimensionMax] of Object.entries(DimensionMax)) VolumeMax[size] = (dimensionMax ** 3);

/** @type {Size<Range>} */
export const VolumeRange = new Size();
for (const [size, volumeMax] of Object.entries(VolumeMax)) {
  let sizePrev;
  let volumeMaxPrev;

  const index = sizes.indexes[size];
  if (index > 0) {
    sizePrev = sizes[index - 1];
    volumeMaxPrev = VolumeMax[sizePrev];
  }

  const lower = (size === sizes.first) ? 0 : volumeMaxPrev;
  const upper = (size === sizes.last) ? Infinity : volumeMax;
  VolumeRange[size] = new Range(lower, upper);
}
