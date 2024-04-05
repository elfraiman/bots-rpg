import { IEnemy, IPlayer } from "../types/types";
import { getEnemies } from "./GetEnemies";






export const GetSpawnHiddenEnemies = async (player: IPlayer) => {
    const enemyList = await getEnemies({ location: player?.location });
    // We want to get the hidden enemies for the location and give it a chance to spawn
    // 
    const filteredList = enemyList?.filter((enemy: IEnemy) => enemy.hidden) ?? [];

    if (filteredList.length > 0) {
        // Filter the list based on a random chance compared to each enemy's chance to encounter
        const spawnedEnemies = filteredList.filter((enemy: IEnemy) => {
            // Generate a random number between 0 and 1
            const randomNumber = Math.random();

            // Compare the random number to the enemy's chance to encounter
            if (enemy.chanceToEncounter) {
                return randomNumber <= enemy.chanceToEncounter;
            }
        });
        // Return the list of enemies that have "spawned" based on the random chance
        return spawnedEnemies;
    }
    return [];
}
