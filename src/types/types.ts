import Realm from "realm-web";
export type IEnemy = {
  _id: number;
  con: number;
  description: string;
  dex: number;
  equipment?: IEnemy_equipment;
  int: number;
  level: number;
  maxHealth: number;
  name: string;
  str: number;
};

export const IEnemySchema = {
  name: 'IEnemy',
  properties: {
    _id: 'int',
    con: 'int',
    description: 'string',
    dex: 'int',
    equipment: 'IEnemy_equipment',
    int: 'int',
    level: 'int',
    maxHealth: 'int',
    name: 'string',
    str: 'int',
  },
  primaryKey: '_id',
};

export type IEnemy_equipment = {
  mainHand?: IEnemy_equipment_mainHand;
};

export const IEnemy_equipmentSchema = {
  name: 'IEnemy_equipment',
  embedded: true,
  properties: {
    mainHand: 'IEnemy_equipment_mainHand',
  },
};

export type IEnemy_equipment_mainHand = {
  maxDamage?: number;
  minDamage?: number;
  name?: string;
};

export const IEnemy_equipment_mainHandSchema = {
  name: 'IEnemy_equipment_mainHand',
  embedded: true,
  properties: {
    maxDamage: 'int?',
    minDamage: 'int?',
    name: 'string?',
  },
};

export type IPlayer = {
  _id: string;
  con: number;
  dex: number;
  equipment?: IPlayer_equipment;
  experience: number;
  gold: number;
  int: number;
  inventory: Realm.List<IPlayer_inventory>;
  level: number;
  maxHealth: number;
  name: string;
  str: number;
};

export const IPlayerSchema = {
  name: 'IPlayer',
  properties: {
    _id: 'string',
    con: 'int',
    dex: 'int',
    equipment: 'IPlayer_equipment',
    experience: 'int',
    gold: 'int',
    int: 'int',
    inventory: 'IPlayer_inventory[]',
    level: 'int',
    maxHealth: 'int',
    name: 'string',
    str: 'int',
  },
  primaryKey: '_id',
};

export type IPlayer_equipment = {
  mainHand?: IPlayer_equipment_mainHand;
};

export const IPlayer_equipmentSchema = {
  name: 'IPlayer_equipment',
  embedded: true,
  properties: {
    mainHand: 'IPlayer_equipment_mainHand',
  },
};

export type IPlayer_equipment_mainHand = {
  id?: Realm.BSON.ObjectId;
  maxDamage?: number;
  minDamage?: number;
  name?: string;
};

export const IPlayer_equipment_mainHandSchema = {
  name: 'IPlayer_equipment_mainHand',
  embedded: true,
  properties: {
    id: 'objectId?',
    maxDamage: 'int?',
    minDamage: 'int?',
    name: 'string?',
  },
};

export type IPlayer_inventory = {
};

export const IPlayer_inventorySchema = {
  name: 'IPlayer_inventory',
  embedded: true,
  properties: {},
};

export type IWeapon = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  maxDamage: number;
  minDamage: number;
  name: string;
  requirements?: IWeapon_requirements;
};

export const IWeaponSchema = {
  name: 'IWeapon',
  properties: {
    _id: 'objectId',
    cost: 'int',
    maxDamage: 'int',
    minDamage: 'int',
    name: 'string',
    requirements: 'IWeapon_requirements',
  },
  primaryKey: '_id',
};

export type IWeapon_requirements = {
  dex: number;
  str: number;
};

export const IWeapon_requirementsSchema = {
  name: 'IWeapon_requirements',
  embedded: true,
  properties: {
    dex: 'int',
    str: 'int',
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
