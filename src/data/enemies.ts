
import * as Realm from "realm-web";
import { enemy } from "../types/schemas";


const enemies: enemy[] = [
    {
        _id: 0,
        level: 1,
        str: 1,
        dex: 1,
        con: 1,
        int: 1,
        maxHealth: 100,
        equipment: {
            mainHand: {
                maxDamage: 5,
                minDamage: 3,
                name: 'Wooden sword'
            }
        },
        name: 'Training dummy',
        description: `A simple, level 1 construct designed for practice,
        it stands ready for battle but doesn't fight back.
        Ideal for honing your bot's skills in the early stages of the game.`
    },
    {
        _id: 1,
        level: 3,
        str: 3,
        dex: 6,
        con: 2,
        int: 4,
        maxHealth: 75,
        equipment: {
            mainHand: {
                maxDamage: 5,
                minDamage: 3,
                name: 'Wooden dagger'
            }
        },
        name: "Shadow Stalker",
        description: "A swift and elusive enemy, the Shadow Stalker thrives in the darkness. Its attacks are quick and can catch any unprepared bot off guard, testing both reflexes and strategy."
    }
    
];

export const getEnemies = () => enemies;
export const getEnemy = (id: number) => enemies.find(m => m._id === id);
