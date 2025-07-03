import { Color, Tile } from "@yetanotherroguelike/class";


/**
 * @extends Tile
 */
const Empty = class extends Tile {
  // #region Instance
  constructor () {
    super();
    this.name = "Empty";
    this.description = "nothing";
    this.display.push("empty");
    this.color = Color.background;

    this.destructible = true;
  }
  // #endregion


  // #region Serialize
  /** @type {string} */ static name = "Empty";
  // #endregion
};
export default Empty;

Tile.register(Empty);
