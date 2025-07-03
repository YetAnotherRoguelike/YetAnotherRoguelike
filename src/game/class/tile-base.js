import Entity from "./entity.js";


const TileBase = class {
  // #region Static
  /** @type {number} */ static dimensionBase = 5;
  /** @type {number} */ static height = 10;
  /** @type {number} */ static heightMin = Entity.dimensionUnitMin;
  // #endregion
};
export default TileBase;
