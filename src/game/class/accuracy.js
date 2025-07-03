import TileBase from "./tile-base.js";


/**
 * @callback AccuracyFunction
 * @param {number} distance ft
 * @param {number} [decay]
 * @returns {number} [0, 1]
 */

/**
 * @enum {AccuracyFunction}
 */
const Accuracy = class {
  // #region Enum
  static standard = () => 1;

  static guaranteed = () => Infinity;

  static melee = (distance) => (TileBase.dimensionBase / distance);

  static ranged = (distance, decay) => {
    const effective = (2 * TileBase.dimensionBase);

    if (distance < effective) return (distance / effective);
    return (1 / ((1 + decay) ** (distance - effective)));
  };

  static area = (distance, decay) => (1 / ((1 + decay) ** (distance - TileBase.dimensionBase)));
  // #endregion


  // #region Serialize
  /**
   * @param {string} name
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
  // #endregions
};
export default Accuracy;
