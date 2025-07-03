import { Color, Tile } from "@yetanotherroguelike/class";


/**
 * @extends Tile
 */
const Wall = class extends Tile {
  // #region Instance
  constructor () {
    super();
    this.name = "Wall";
    this.description = "a wall";
    this.display.push("wall");
    this.color = Color.gray;
    this.width = 0.75;
    this.volumeFactor = 1.0;
    this.density = 165;
  }
  // #endregion


  // #region Serialize
  /** @type {string} */ static name = "Wall";
  // #endregion
};
export default Wall;

Tile.register(Wall);
