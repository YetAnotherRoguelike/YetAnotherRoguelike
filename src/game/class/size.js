import { Range } from "@kxirk/adt";


const tinyMax = (2 ** 3); // ft^3
export const tiny = new Range(0, tinyMax);

const smallMax = (4 ** 3); // ft^3
export const small = new Range(tinyMax, smallMax);

const mediumMax = (8 ** 3); // ft^3
export const medium = new Range(smallMax, mediumMax);

const largeMax = (16 ** 3); // ft^3
export const large = new Range(mediumMax, largeMax);

export const giant = new Range(largeMax, Infinity);


/** @enum {Range} */
const Size = class {
  static tiny = tiny;
  static small = small;
  static medium = medium;
  static large = large;
  static giant = giant;
};
export default Size;
