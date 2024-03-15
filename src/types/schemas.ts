import Realm from "realm-web";

export type Ienemy = {
  _id: number;
  con: number;
  description: string;
  dex: number;
  equipment?: enemy_equipment;
  int: number;
  level: number;
  maxHealth: number;
  name: string;
  str: number;
};

export const enemySchema = {
  name: 'enemy',
  properties: {
    _id: 'int',
    con: 'int',
    description: 'string',
    dex: 'int',
    equipment: 'enemy_equipment',
    int: 'int',
    level: 'int',
    maxHealth: 'int',
    name: 'string',
    str: 'int',
  },
  primaryKey: '_id',
};

export type enemy_equipment = {
  mainHand?: enemy_equipment_mainHand;
};

export const enemy_equipmentSchema = {
  name: 'enemy_equipment',
  embedded: true,
  properties: {
    mainHand: 'enemy_equipment_mainHand',
  },
};

export type enemy_equipment_mainHand = {
  maxDamage?: number;
  minDamage?: number;
  name?: string;
};

export const enemy_equipment_mainHandSchema = {
  name: 'enemy_equipment_mainHand',
  embedded: true,
  properties: {
    maxDamage: 'int?',
    minDamage: 'int?',
    name: 'string?',
  },
};

export type Iplayer = {
  _id: string;
  con: number;
  dex: number;
  equipment?: player_equipment;
  experience: number;
  gold: number;
  int: number;
  level: number;
  maxHealth: number;
  name: string;
  str: number;
};

export const playerSchema = {
  name: 'player',
  properties: {
    _id: 'string',
    con: 'int',
    dex: 'int',
    equipment: 'player_equipment',
    experience: 'int',
    gold: 'int',
    int: 'int',
    level: 'int',
    maxHealth: 'int',
    name: 'string',
    str: 'int',
  },
  primaryKey: '_id',
};

export type player_equipment = {
  mainHand?: player_equipment_mainHand;
};

export const player_equipmentSchema = {
  name: 'player_equipment',
  embedded: true,
  properties: {
    mainHand: 'player_equipment_mainHand',
  },
};

export type player_equipment_mainHand = {
  id?: Realm.BSON.ObjectId;
  maxDamage?: number;
  minDamage?: number;
  name?: string;
};

export const player_equipment_mainHandSchema = {
  name: 'player_equipment_mainHand',
  embedded: true,
  properties: {
    id: 'objectId?',
    maxDamage: 'int?',
    minDamage: 'int?',
    name: 'string?',
  },
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

export type weapon = {
  _id?: Realm.BSON.ObjectId;
  maxDamage: number;
  minDamage: number;
  name: string;
  requirements?: weapon_requirements;
};

export const weaponSchema = {
  name: 'weapon',
  properties: {
    _id: 'objectId?',
    maxDamage: 'int',
    minDamage: 'int',
    name: 'string',
    requirements: 'weapon_requirements',
  },
  primaryKey: '_id',
};

export type weapon_requirements = {
  con?: number;
  dex?: number;
  int?: number;
  str?: number;
};

export const weapon_requirementsSchema = {
  name: 'weapon_requirements',
  embedded: true,
  properties: {
    con: 'int?',
    dex: 'int?',
    int: 'int?',
    str: 'int?',
  },
};
