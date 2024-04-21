import * as Realm from 'realm-web';
import { IEnemy } from "../types/types";
import { getEnemies } from "./GetEnemies";


/**
 * Retrieves a list of hidden enemies from a specified location that have a chance to spawn.
 * This function first fetches all enemies for a given location and then filters to include only those marked as hidden.
 * Each hidden enemy is subjected to a random spawn chance, determined by comparing a random number with the enemy's defined `chanceToEncounter`.
 *
 * @param {Realm.BSON.ObjectId} location - The BSON ObjectId representing the location in the database where enemies are to be fetched.
 * @returns {Promise<IEnemy[]>} An array of enemies that have successfully spawned based on their spawn probability.
 * This array may be empty if no hidden enemies are available or if none meet the spawn criteria.
 *
 * Usage:
 * - This function is typically used to add variability and unpredictability,
 *   allowing for dynamic encounters with enemies that are not always visible or predictable.
 */
export const chanceToSpawnHiddenEnemies = async (location: Realm.BSON.ObjectId) => {
    const enemyList = await getEnemies({ location: location });
    const filteredList = enemyList?.filter((enemy: IEnemy) => enemy.hidden) ?? [];

    if (filteredList.length > 0) {
        const spawnedEnemies = filteredList.filter((enemy: IEnemy) => {
            const randomNumber = Math.random();
            return enemy.chanceToEncounter && randomNumber < (enemy.chanceToEncounter as unknown as number);
        });
        return spawnedEnemies;
    }
    return [];
}
