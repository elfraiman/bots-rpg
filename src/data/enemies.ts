
import { enemy } from "../types/schemas";


const enemies: enemy[] = [
    {
        _id: 0,
        level: 1,
        maxDmg: 3,
        maxHealth: 100,
        minDmg: 1,
        name: 'Training dummy',
        description: `A simple, level 1 construct designed for practice,
        it stands ready for battle but doesn't fight back.
        Ideal for honing your bot's skills in the early stages of the game.`
    },
    {
        _id: 1,
        level: 2,
        maxDmg: 6,
        maxHealth: 200,
        minDmg: 2,
        name: 'Goblin',
        description: `A small, green creature with a penchant for mischief.`
    },
    {
        _id: 2,
        level: 3,
        maxDmg: 9,
        maxHealth: 300,
        minDmg: 3,
        name: 'Orc',
        description: `A large, brutish humanoid with a taste for violence.`,
    },
    {
        _id: 3,
        level: 4,
        maxDmg: 12,
        maxHealth: 400,
        minDmg: 4,
        name: 'Troll',
        description: `A large, brutish humanoid with a taste for violence.`
    },
    {
        _id: 4,
        level: 5,
        maxDmg: 15,
        maxHealth: 500,
        minDmg: 5,
        name: 'Dragon',
        description: `A large, brutish lizard with a taste for violence.`
    }
];

export const getEnemies = () => enemies;
export const getEnemy = (id: number) => enemies.find(m => m._id === id);
