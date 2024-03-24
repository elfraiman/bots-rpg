import * as Realm from "realm-web";



export type IEnemy = {
  _id: Realm.BSON.ObjectID;
  con: number;
  description: string;
  dex: number;
  equipment?: IEnemy_equipment;
  int: number;
  level: number;
  maxHealth: number;
  name: string;
  str: number;
  type: 'standard' | 'elite' | 'boss';
  location: string;
  imgId: number;
};



export type IPlanet = {
  _id: Realm.BSON.ObjectId;
  description: string;
  imgId: number;
  name: string;
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
  attributePoints: number;
  con: number;
  dex: number;
  equipment?: IPlayer_equipment;
  experience: number;
  gold: number;
  int: number;
  inventory: IWeapon[];
  level: number;
  maxHealth: number;
  name: string;
  str: number;
  location: string;
};


export type IPlayer_equipment = {
  mainHand?: IWeapon;
};

export const IPlayer_equipmentSchema = {
  name: 'IPlayer_equipment',
  embedded: true,
  properties: {
    mainHand: 'weapon',
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
  _id: number;
  cost: number;
  description: string;
  grade: string;
  imgId: number;
  maxDamage: number;
  minDamage: number;
  name: string;
  requirements: IWeapon_requirements;
};

export const IWeaponSchema = {
  name: 'IWeapon',
  properties: {
    _id: 'int',
    cost: 'int',
    description: 'string',
    grade: 'string',
    imgId: 'int',
    maxDamage: 'int',
    minDamage: 'int',
    name: 'string',
    requirements: 'IWeapon_requirements',
  },
  primaryKey: '_id',
};

export type IWeapon_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};

export const IWeapon_requirementsSchema = {
  name: 'IWeapon_requirements',
  embedded: true,
  properties: {
    con: 'int?',
    dex: 'int?',
    int: 'int?',
    str: 'int?',
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
  cost?: number;
  description?: string;
  imgId?: number;
  maxDamage?: number;
  minDamage?: number;
  name?: string;
  requirements?: weapon_requirements;
};

export const weaponSchema = {
  name: 'weapon',
  embedded: true,
  properties: {
    _id: 'objectId?',
    cost: 'int?',
    description: 'string?',
    imgId: 'int?',
    maxDamage: 'int?',
    minDamage: 'int?',
    name: 'string?',
    requirements: 'weapon_requirements',
  },
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
