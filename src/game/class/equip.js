/** @enum {string[]} */
const Equip = class {
  static item = ["side", "hand"];

  static armorLight = ["armor"];
  static armorMedium = ["armor"];
  static armorHeavy = ["armor"];

  static weaponLight = ["side", "hand"];
  static weaponMedium = ["hand"];
  static weaponHeavy = ["both"];
  static weaponRanged = ["side", "hand"];

  static shieldLight = ["side", "hand"];
  static shieldMedium = ["side", "hand"];
  static shieldHeavy = ["hand"];

  static accessory = ["accessories"];
};
export default Equip;
