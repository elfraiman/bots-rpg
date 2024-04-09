interface IXPCalculationParams {
  playerLevel: number;
  enemyLevel: number;
  enemyType: 'standard' | 'elite' | 'boss';
  efficiencyBonus?: number; // This could be based on how quickly or skillfully the player defeats the enemy
}

function getXpReward({ playerLevel, enemyLevel, enemyType, efficiencyBonus = 1 }: IXPCalculationParams): number {
  const BASE_XP = 35; // Base experience for an enemy at level 1
  let DIFFICULTY_MODIFIER: number;

  switch (enemyType) {
    case 'standard':
      DIFFICULTY_MODIFIER = 1.0;
      break;
    case 'elite':
      DIFFICULTY_MODIFIER = 1.5;
      break;
    case 'boss':
      DIFFICULTY_MODIFIER = 2.0;
      break;
    default:
      DIFFICULTY_MODIFIER = 1.0; // Default case, though you might handle it differently
  }

  const levelDifference = enemyLevel - playerLevel;
  const levelDifferenceBonus = Math.max(-50, Math.min(levelDifference * 10, 50)); // Ensure the bonus/penalty is within a reasonable range

  // Introduce variability
  const variabilityPercentage = 0.4; // 40% variability
  const randomVariability = 1 + ((Math.random() * (variabilityPercentage * 2)) - variabilityPercentage);

  // Calculate the final XP with variability
  const xp = (BASE_XP * enemyLevel * DIFFICULTY_MODIFIER) * (1 + (levelDifferenceBonus / 100)) * efficiencyBonus * randomVariability;

  return Math.round(xp); // Round to the nearest whole number
}

export default getXpReward;
