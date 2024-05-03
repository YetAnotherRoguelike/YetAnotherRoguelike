import { Tile } from "@yetanotherroguelike/class";


const Empty = class extends Tile {
  constructor () {
    super();
    this.name = "Empty";
    this.description = "nothing";

    this.display.push("empty");
    this.color = "background";

    this.destructible = true;
  }
};
Tile.Empty = Empty;
export default Empty;
