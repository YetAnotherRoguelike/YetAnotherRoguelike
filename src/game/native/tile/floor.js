import { Tile } from "@yetanotherroguelike/class";


const Floor = class extends Tile {
  constructor () {
    super();
    this.name = "Floor";
    this.description = "nothing";

    this.display.push("floor");
    this.color = "charcoal";

    this.destructible = true;
    this.transparent = true;
    this.walkable = true;
  }
};
Tile.Floor = Floor;
export default Floor;
