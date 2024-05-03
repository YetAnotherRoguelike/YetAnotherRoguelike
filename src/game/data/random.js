import Random from "@kxirk/random";


/** @type {Random} */
const random = new Random();
export default random;

Object.defineProperty(random, "fromJSON", {
  /**
   * @param {Object} json
   * @returns {Random}
   */
  value (json) {
    random.seed = json.seed;
    random.state = json.state;

    return random;
  },
  enumerable: false
});

Object.defineProperty(random, "toJSON", {
  /** @returns {Object} */
  value () {
    return {
      seed: random.seed,
      state: random.state
    };
  },
  enumerable: false
});
