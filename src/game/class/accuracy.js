/**
 * @callback AccuracyFunction
 * @param {number} distance ft
 * @param {number} [decay]
 * @returns {number} [0, 1]
 */

/** @enum {AccuracyFunction} */
const Accuracy = class {
  /**
   * @param {string} json
   * @returns {AccuracyFunction}
   */
  static fromJSON (name) {
    return Accuracy[name];
  }

  /**
   * @returns {string}
   */
  static toJSON () {
    return this.name;
  }


  static standard = () => 1;

  static guaranteed = () => Infinity;

  static melee = (distance) => 5 / distance;

  static ranged = (distance, decay) => {
    if (distance < 10) return distance / 10;
    return 1 / ((1 + decay) ** (distance - 10));
  };

  static area = (distance, decay) => 1 / ((1 + decay) ** (distance - 5));
};
export default Accuracy;
