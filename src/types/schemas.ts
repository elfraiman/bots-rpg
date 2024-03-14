import Realm from "realm-web";

export type enemy = {
  _id?: number;
  level?: number;
  maxDmg?: number;
  maxHealth?: number;
  minDmg?: number;
  name?: string;
  description?: string;
};

export const enemySchema = {
  name: 'enemy',
  properties: {
    _id: 'objectId?',
    level: 'int?',
    maxDmg: 'int?',
    maxHealth: 'int?',
    minDmg: 'int?',
    name: 'string?',
  },
  primaryKey: '_id',
};

export type player = {
  _id: string;
  con: number;
  dex: number;
  experience: number;
  gold: number;
  int: number;
  level: number;
  maxHp: number;
  name: string;
  str: number;
};

export const playerSchema = {
  name: 'player',
  properties: {
    _id: 'string',
    con: 'int',
    dex: 'int',
    experience: 'int',
    gold: 'int',
    int: 'int',
    level: 'int',
    maxHp: 'int',
    name: 'string',
    str: 'int',
  },
  primaryKey: '_id',
};

export type quests = {
  _id: Realm.BSON.ObjectId;
  description?: string;
  name?: string;
  rewards?: quests_rewards;
};

export const questsSchema = {
  name: 'quests',
  properties: {
    _id: 'objectId',
    description: 'string?',
    name: 'string?',
    rewards: 'quests_rewards',
  },
  primaryKey: '_id',
};

export type quests_rewards = {
  experience?: number;
  gold?: number;
};

export const quests_rewardsSchema = {
  name: 'quests_rewards',
  embedded: true,
  properties: {
    experience: 'int?',
    gold: 'int?',
  },
};
