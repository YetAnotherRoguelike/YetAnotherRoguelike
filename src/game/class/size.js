import { Range } from "@kxirk/adt";


/** @enum {number} ft */
export const DimensionMax = class {
  static tiny = 2;
  static small = 4;
  static medium = 8;
  static large = 16;
  static giant = 32;
};


/** @enum {number} ft^3 */
export const SizeMax = class {
  static tiny = (DimensionMax.tiny ** 3);
  static small = (DimensionMax.small ** 3);
  static medium = (DimensionMax.medium ** 3);
  static large = (DimensionMax.large ** 3);
  static giant = (DimensionMax.giant ** 3);
};


export const tiny = new Range(0, SizeMax.tiny);
tiny.dimensionMax = DimensionMax.tiny;

export const small = new Range(SizeMax.tiny, SizeMax.small);
small.dimensionMax = DimensionMax.small;

export const medium = new Range(SizeMax.small, SizeMax.medium);
medium.dimensionMax = DimensionMax.medium;

export const large = new Range(SizeMax.medium, SizeMax.large);
large.dimensionMax = DimensionMax.large;

export const giant = new Range(SizeMax.large, Infinity);
giant.dimensionMax = DimensionMax.giant;

/** @enum {Range} */
const Size = class {
  static tiny = tiny;
  static small = small;
  static medium = medium;
  static large = large;
  static giant = giant;
};
export default Size;
