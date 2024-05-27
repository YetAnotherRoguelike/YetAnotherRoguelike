import Entity from "./entity.js";


const Decoration = class extends Entity {
  constructor () {
    super();
    this.display.push("decoration");
  }
};
export default Decoration;
