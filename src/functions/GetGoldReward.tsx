import { IEnemy } from "../types/types";



interface IGetGoldRewardProps {
    playerLevel: number;
    enemy: IEnemy;
}



const getGoldReward = ({ playerLevel, enemy }: IGetGoldRewardProps) => {
    const baseGold = 10; // Starting gold for level 1 enemy
    const difficultyModifier = getDifficultyModifier(enemy.type);
    const levelDifference = enemy.level - playerLevel;
    const levelDifferenceBonus = Math.max(-50, Math.min(levelDifference * 5, 50)); // Caps the bonus/penalty between -50% and +50%

    const gold = Math.round((baseGold * enemy.level * difficultyModifier) * (1 + (levelDifferenceBonus / 100)));
    return gold;
}

const getDifficultyModifier = (type: string) => {
    switch (type) {
        case 'standard': return 1.0;
        case 'elite': return 1.5;
        case 'boss': return 2.0;
        default: return 1.0; // Default to standard if unknown
    }
}


export default getGoldReward;