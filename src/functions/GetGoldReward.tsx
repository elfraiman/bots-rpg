import { IEnemy } from "../types/types";



interface IGetGoldRewardProps {
    playerLevel: number;
    enemy: IEnemy;
}



const getGoldReward = ({ playerLevel, enemy }: IGetGoldRewardProps) => {
    const getDifficultyModifier = (type: string) => {
        switch (type) {
            case 'standard': return 1.0;
            case 'elite': return 1.5;
            case 'boss': return 2.0;
            default: return 1.0; // Default to standard if unknown
        }
    };

    const getRandomVariability = () => {
        const variabilityPercentage = 0.2; // 20% variability
        // Generates a random percentage between -10% and +10%
        return 1 + ((Math.random() * (variabilityPercentage * 2)) - variabilityPercentage);
    };

    const baseGold = 2; // Starting gold for level 1 enemy
    const difficultyModifier = getDifficultyModifier(enemy.type);
    const levelDifference = enemy.level - playerLevel;
    const levelDifferenceBonus = Math.max(-50, Math.min(levelDifference * 5, 50)); // Caps the bonus/penalty between -50% and +50%

    let gold = Math.round((baseGold * enemy.level * difficultyModifier) * (1 + (levelDifferenceBonus / 100)));

    // Apply variability
    gold = Math.round(gold * getRandomVariability());
    return gold;
};





export default getGoldReward;