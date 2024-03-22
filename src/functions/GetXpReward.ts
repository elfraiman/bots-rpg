interface IXPCalculationParams {
    playerLevel: number;
    enemyLevel: number;
    enemyType: 'standard' | 'elite' | 'boss';
    efficiencyBonus?: number; // This could be based on how quickly or skillfully the player defeats the enemy
  }
  
  function getXpReward({ playerLevel, enemyLevel, enemyType, efficiencyBonus = 1 }: IXPCalculationParams): number {
    const baseXP = 10; // Base experience for an enemy at level 1
    let difficultyModifier: number;
  
    switch (enemyType) {
      case 'standard':
        difficultyModifier = 1.0;
        break;
      case 'elite':
        difficultyModifier = 1.5;
        break;
      case 'boss':
        difficultyModifier = 2.0;
        break;
      default:
        difficultyModifier = 1.0; // Default case, though you might handle it differently
    }
  
    const levelDifference = enemyLevel - playerLevel;
    const levelDifferenceBonus = Math.max(-50, Math.min(levelDifference * 10, 50)); // Ensure the bonus/penalty is within a reasonable range
  
    // Calculate the final XP
    const xp = (baseXP * enemyLevel * difficultyModifier) * (1 + (levelDifferenceBonus / 100)) * efficiencyBonus;
  
    return Math.round(xp); // Round to the nearest whole number
  }
  


  export default getXpReward;