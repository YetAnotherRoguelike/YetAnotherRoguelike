/**
 * @callback AccuracyFunction
 * @param {number} distance ft
 * @returns {number} [0, 1]
 */

/** @enum {AccuracyFunction} */
const Accuracy = class {
  static standard = () => 1;

  static guaranteed = () => Infinity;

  static melee = (distance) => 5 / distance;

  static ranged = (distance) => {
    if (distance < 10) return distance / 10;
    return 1 / (1.02 ** (distance - 10));
  };

  static area = (distance) => 1 / (1.02 ** (distance - 5));
};
export default Accuracy;
