import { IEnemy, IPlayer } from "../types/types";





const calculateMaxHealth = (character: IPlayer | IEnemy) => {

    const healthPerCon = 5; // Additional health per Constitution point
    const baseHealth = 50;
    const healthFromCon = character.con * healthPerCon;

    // Additional health scaling with level; assuming players and enemies get stronger with level
    // This factor could be adjusted or made more complex based on game design needs
    const levelHealthBonus = character.level * 5;

    const maxHealth = baseHealth + healthFromCon + levelHealthBonus;

    return maxHealth;
}

export default calculateMaxHealth;
