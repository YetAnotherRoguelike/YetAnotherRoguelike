import { fromJSON, toJSON } from "@kxirk/serialize";
import Random from "@kxirk/random";


/** @type {Function} */ let seed = Random.generateSeed();

/** @type {Random} */ const random = new Random(seed);
export default new Proxy(random, {
  get: (target, property) => {
    if (property === "seed") return seed;

    if (["next", "nextTriangular", "nextNormal", "nextBoolean", "nextSign"].includes(property)) return target[property].bind(random);

    return target[property];
  },
  set: (target, property, value) => {
    if (property === "seed") {
      seed = value;
      return seed;
    }

    return false;
  }
});


Object.defineProperty(random, "fromJSON", {
  /**
   * @param {Object} json
   * @param {Function} [reviver]
   * @modifies {this}
   * @returns {this}
   */
  value (json, reviver) {
    seed = fromJSON(json, {}, "seed", reviver?.seed);
    this.state = fromJSON(json, this, "state", reviver?.state);

    return this;
  },
  enumerable: false
});

Object.defineProperty(random, "toJSON", {
  /**
   * @param {string} key
   * @param {Function} [replacer]
   * @returns {Object}
   */
  value (key, replacer) {
    const json = {};

    json.seed = toJSON(seed, undefined, replacer?.seed);
    json.state = toJSON(this, "state", replacer?.state);

    return json;
  },
  enumerable: false
});
