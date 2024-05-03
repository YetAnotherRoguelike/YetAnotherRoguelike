import { Tile } from "@yetanotherroguelike/class";


const Wall = class extends Tile {
  constructor () {
    super();
    this.name = "Wall";
    this.description = "a wall";

    this.display.push("wall");
    this.color = "gray";

    this.volumeFactor = 0.15;
    this.density = 165;
  }
};
Tile.Wall = Wall;
export default Wall;
