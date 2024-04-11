import { IEnemy, IPlayer } from "./types";


export const MIN_ATTACK_INTERVAL = 1600; // Minimum interval in milliseconds (e.g., 500ms = 0.5 seconds)
export const BASE_ATTACK_SPEED = 3000; // Base attack speed
export const DEX_MODIFIER = 0.0035; // Amount dex effects attack speed
/**
 * Calculates the modified attack speed of a weapon based on the character's dexterity (dex).
 *
 * The formula for calculating attack speed is:
 * Modified Attack Speed = Weapon Base Attack Speed / (1 + (Dexterity * Dexterity Modifier))
 *
 * This calculation ensures that a character's dexterity positively affects their weapon's attack speed, making attacks faster.
 * The dexterity modifier represents how much each point of dexterity contributes to reducing the time between attacks,
 * enabling quicker responses in combat situations.
 *
 * A minimum attack interval is enforced to prevent the attack speed from becoming unrealistically fast, maintaining game balance.
 * This ensures that while dexterity significantly enhances attack speed, it does not exceed a predefined minimum interval,
 * preserving fairness and strategic game play elements.
 *
 * @param {number} weaponAttackSpeed - The base attack speed of the weapon, before any modifications.
 * @param {number} dex - The dexterity stat of the character wielding the weapon.
 * @returns {number} The modified attack speed, taking into account the character's dexterity.
 */
export const calculateAttackSpeed = (weaponAttackSpeed: number, dex: number) => {
  // Calculate the raw speed factoring in the dexterity's influence on reducing the weapon's attack interval.
  const rawSpeed = weaponAttackSpeed / (1 + (dex * DEX_MODIFIER));

  // Ensure the calculated speed does not fall below the minimum allowed attack interval for game balance.
  return Math.max(rawSpeed, MIN_ATTACK_INTERVAL);
};


export const BASE_HIT_CHANCE = 0.7; // The base hit chance before modifications. 0.7 = 70%
export const MINIMAL_HIT_CHANCE = 0.10 // a fixed bonus to the hit chance (e.g., 5% or 0.05 in decimal form) to ensure there's always a minimal chance of hitting.
export const DEX_ACCURACY_MODIFIER = 0.02;
export const EVASION_EFFECT_MODIFIER = 0.02;
/**
 * Calculates the chance of a successful hit in combat based on the dexterity of the attacker and defender,
 * and factoring in the defender's evasion.
 *
 * The formula incorporates several elements:
 * 1. A base hit chance that establishes the foundational likelihood of an attack connecting.
 * 2. The influence of the dexterity differential between the attacker and defender, adjusted by a dexterity accuracy modifier.
 *    This adjustment represents the effect of agility differences on combat effectiveness.
 * 3. The introduction of evasion as a defensive stat that directly diminishes the attacker's hit chance.
 *    Evasion represents the defender's ability to avoid attacks, reducing the likelihood of a hit. The more evasion points a defender has,
 *    the greater the reduction in the attacker's hit chance, illustrating the significance of mobility and agility in avoiding damage.
 * 4. A minimum hit chance to guarantee there's always a possibility, however slim, of an attack hitting its mark,
 *    which mirrors the unpredictable and dynamic nature of combat scenarios.
 *
 * The final calculated hit chance is constrained between a minimum value and 100% to ensure game balance and a realistic combat experience.
 *
 * @param {number} attackerDex - The dexterity stat of the attacker, influencing hit chance positively.
 * @param {number} defenderDex - The dexterity stat of the defender, influencing hit chance negatively.
 * @param {number} evasion - The evasion stat of the defender, further reducing the hit chance. (The opponent that you're hitting)
 * @returns {number} The calculated chance of a hit, as a decimal between 0 and 1, inclusive, with 1 being a guaranteed hit and 0 a guaranteed miss.
 */
export const calculateHitChance = (attackerDex: number, defenderDex: number, evasion: number = 0) => {
  // Calculate the difference in dexterity between the attacker and defender, then apply the accuracy modifier.
  const dexEffect = (attackerDex - defenderDex) * DEX_ACCURACY_MODIFIER;

  // Apply the effect of evasion, assuming each point of evasion reduces hit chance by a small percentage.
  // This can be adjusted based on how powerful you want evasion to be.
  const evasionEffect = evasion * EVASION_EFFECT_MODIFIER;

  // Calculate initial hit chance including dex and evasion effects.
  let hitChance = BASE_HIT_CHANCE + dexEffect - evasionEffect;

  // Ensure the final hit chance does not exceed 100% and is not below the minimal hit chance.
  hitChance = Math.max(Math.min(hitChance, 1), MINIMAL_HIT_CHANCE);

  return hitChance;
}

export const STR_ATTACK_MODIFIER = 0.2 // 20% modifier to the base str meaning str has 20% value on the final damage output;
export const BASE_DAMAGE_INCREASE = 1; // Base damage increase to make sure we dont get 0 values
export const DEFENSE_MODIFIER = 0.05; // Each point in defense reduces incoming damage by 5%
/**
 * Modifies the calculateDamage function to consider the defender's defense stat.
 * Defense directly reduces the damage inflicted by the attacker's min and max attack values,
 * after applying strength modifiers and base damage increase.
 *
 * The defense reduction applies as a percentage decrease to the total damage output,
 * based on the DEFENSE_MODIFIER. This system ensures that higher defense leads to
 * significantly reduced incoming damage, emphasizing the importance of defense
 * in mitigating damage from powerful attacks.
 *
 * The formula now includes:
 * 1. Calculating the attacker's modified damage output based on strength and base damage.
 * 2. Applying the defense modifier to reduce the damage, reflecting the defender's
 *    ability to absorb or deflect attacks.
 * 3. Rounding the final adjusted damage values to integers suitable for game mechanics.
 *
 * This adjustment provides a balanced approach to combat, allowing both offensive and
 * defensive strategies to play pivotal roles in the outcome of battles.
 *
 * @param {number} minAttackBase - The base minimum attack damage before modifications.
 * @param {number} maxAttackBase - The base maximum attack damage before modifications.
 * @param {number} str - The player's strength attribute.
 * @param {number} defense - The defender's defense attribute. (The opponent that you're hitting)
 * @returns {object} An object containing the calculated minimum and maximum attack damage after defense adjustments.
 */
export const calculateDamage = (minAttackBase: number, maxAttackBase: number, str: number, defense: number = 0) => {
  const attackModifier = str * STR_ATTACK_MODIFIER;
  // Calculate initial damage without considering defense
  let minAttack = Math.round(minAttackBase + attackModifier + BASE_DAMAGE_INCREASE);
  let maxAttack = Math.round(maxAttackBase + attackModifier + BASE_DAMAGE_INCREASE);

  // Apply defense reduction to both min and max attack
  const defenseReduction = 1 - (defense * DEFENSE_MODIFIER); // Calculate the percentage of damage that gets through defense
  minAttack = Math.max(1, Math.round(minAttack * defenseReduction)); // Ensure minAttack is at least 1
  maxAttack = Math.max(1, Math.round(maxAttack * defenseReduction)); // Ensure maxAttack is at least 1

  return { minAttack, maxAttack };
}

export const HEALTH_PER_CON = 5; // amount of health each Con point is equal to.
export const BASE_HEALTH = 30; // Fixed value that every character starts with
/**
 * Calculates the maximum health of a character (either player or enemy) based on their constitution (con), level, and base health values.
 *
 * The formula for calculating maximum health is:
 * Max Health = Base Health + (Constitution * Health per Constitution point) + (Level * Level Health Bonus)
 *
 * - The base health is a fixed value that every character starts with.
 * - Each point in constitution contributes additional health to the character, enhancing their survivability.
 * - The character's level represents their experience and strength, with each level granting additional health, signifying
 *   the character's increased resilience and ability to withstand damage.
 *
 * This approach ensures that both the character's growth in experience (level) and natural resilience (constitution) contribute
 * to their overall health, reflecting their development and training.
 *
 * @param {IPlayer | IEnemy} character - The character for whom to calculate the maximum health. Must have 'con' and 'level' properties.
 * @returns {number} The calculated maximum health of the character.
 */
export const calculateMaxHealth = (character: IPlayer | IEnemy) => {

  // Calculate additional health contributed by the character's constitution.
  const healthFromCon = character.con * HEALTH_PER_CON;

  // Calculate the health bonus from the character's level, assuming higher levels represent stronger characters.
  const levelHealthBonus = character.level * 3;

  // Sum the base health, health from constitution, and health from level to get the character's maximum health.
  const maxHealth = BASE_HEALTH + healthFromCon + levelHealthBonus;

  return maxHealth;
}



export const calculateTotalDefensiveStats = () => {

}