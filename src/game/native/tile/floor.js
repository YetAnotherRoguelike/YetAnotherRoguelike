import { Color, Tile } from "@yetanotherroguelike/class";


/**
 * @extends Tile
 */
const Floor = class extends Tile {
  // #region Instance
  constructor () {
    super();
    this.name = "Floor";
    this.description = "nothing";
    this.display.push("floor");
    this.color = Color.charcoal;
    this.height = Tile.heightMin;
    this.volumeFactor = 1.0;
    this.density = 165;

    this.transparent = true;
    this.walkable = true;
  }
  // #endregion


  // #region Serialize
  /** @type {string} */ static name = "Floor";
  // #endregion
};
export default Floor;

Tile.register(Floor);
