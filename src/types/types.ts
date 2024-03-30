import * as Realm from "realm-web";

export type IEnemy = {
  _id: Realm.BSON.ObjectId;
  con: number;
  description: string;
  dex: number;
  equipment?: IEnemy_equipment;
  imgId: number;
  int: number;
  level: number;
  location: string;
  name: string;
  str: number;
  type: string;
  trashLoot: Array<Realm.BSON.ObjectId>
};

export type IItem = {
  _id: Realm.BSON.ObjectId;
  category: string;
  cost: number;
  description: string;
  imgId: number;
  name: string;
  quantity?: number;
  grade: string;
};


export const IItemSchema = {
  name: 'IItem',
  properties: {
    _id: 'objectId?',
    category: 'string?',
    cost: 'int?',
    description: 'string?',
    imgId: 'int?',
    name: 'string?',
  },
  primaryKey: '_id',
};


export const IEnemySchema = {
  name: 'IEnemy',
  properties: {
    _id: 'objectId',
    con: 'int',
    description: 'string',
    dex: 'int',
    equipment: 'IEnemy_equipment',
    imgId: 'int',
    int: 'int',
    level: 'int',
    location: 'string',
    name: 'string',
    str: 'int',
    type: 'string',
    trashLoot: 'Array<ObjectId>'
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


export type IArmor = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  defense: number;
  description: string;
  grade: string;
  imgId: number;
  name: string;
  requirements: IArmor_requirements;
  sale?: boolean;
};


export type IArmor_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};


export type IShopArmor = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  description: string;
  grade: string;
  imgId: number;
  name: string;
  requirements: IShopArmor_requirements;
  sale: boolean;
  defense: number;
};



export type IShopArmor_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};



export type IPlanet = {
  _id: Realm.BSON.ObjectId;
  description: string;
  imgId: number;
  name: string;
};

export const IPlanetSchema = {
  name: 'IPlanet',
  properties: {
    _id: 'objectId',
    description: 'string',
    imgId: 'int',
    name: 'string',
  },
  primaryKey: '_id',
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
  inventory: any;
  level: number;
  location: string;
  name: string;
  str: number;
};

export const IPlayerSchema = {
  name: 'IPlayer',
  properties: {
    _id: 'string',
    attributePoints: 'int',
    con: 'int',
    dex: 'int',
    equipment: 'IPlayer_equipment',
    experience: 'int',
    gold: 'int',
    int: 'int',
    inventory: 'IPlayer_inventory[]',
    level: 'int',
    location: 'string?',
    name: 'string',
    str: 'int',
  },
  primaryKey: '_id',
};


export type IPlayer_inventory = {
  armors: any;
  boots: any;
  helmets: any;
  weapons: any;
};

export type IPlayer_inventory_armors = {
};
export type IPlayer_inventory_boots = {
};
export type IPlayer_inventory_helmets = {
};
export type IPlayer_inventory_weapons = {
};

export type IPlayer_equipment = {
  armor?: IPlayer_equipment_armor;
  boots?: IPlayer_equipment_boots;
  helmet?: IPlayer_equipment_helmet;
  mainHand?: IPlayer_equipment_mainHand;
};
export type IPlayer_equipment_boots = {
  _id?: Realm.BSON.ObjectId;
  cost?: number;
  defense?: number;
  description?: string;
  imgId?: number;
  grade: string;
  name?: string;
  requirements?: IPlayer_equipment_boots_requirements;
};

export type IBoots = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  defense: number;
  description: string;
  grade: string;
  imgId: number;
  name: string;
  requirements: IBoots_requirements;
  sale?: boolean;
};

export type IBoots_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};

export type IPlayer_equipment_boots_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};
export type IPlayer_equipment_helmet_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};

export type IPlayer_equipment_helmet = {
  _id?: Realm.BSON.ObjectId;
  cost?: number;
  defense?: number;
  description?: string;
  imgId?: number;
  name?: string;
  grade: string;
  requirements: IPlayer_equipment_helmet_requirements;
};

export const IPlayer_equipmentSchema = {
  name: 'IPlayer_equipment',
  embedded: true,
  properties: {
    mainHand: 'IPlayer_equipment_mainHand',
  },
};

export type IPlayer_equipment_armor = {
  _id?: Realm.BSON.ObjectId;
  cost?: number;
  defense?: number;
  description?: string;
  imgId?: number;
  name?: string;
  requirements?: IPlayer_equipment_armor_requirements;
  grade: string;
};



export type IHelmet_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};

export type IShopBoots = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  defense: number;
  description: string;
  grade: string;
  imgId: number;
  name: string;
  requirements: IShopBoots_requirements;
  sale: boolean;
};
export type IShopBoots_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};
export type IShopHelmet = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  defense: number;
  description: string;
  grade: string;
  imgId: number;
  name: string;
  requirements: IShopHelmet_requirements;
  sale: boolean;
};
export type IShopHelmet_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};

export type IHelmet = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  defense: number;
  description: string;
  grade: string;
  imgId: number;
  name: string;
  requirements: IHelmet_requirements;
  sale?: boolean;
};

export type IPlayer_equipment_armor_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};

export type IPlayer_equipment_mainHand = {
  _id?: Realm.BSON.ObjectId;
  cost?: number;
  description?: string;
  imgId?: number;
  maxDamage?: number;
  minDamage?: number;
  name?: string;
  grade: string;
  requirements?: IPlayer_equipment_mainHand_requirements;
};

export const IPlayer_equipment_mainHandSchema = {
  name: 'IPlayer_equipment_mainHand',
  embedded: true,
  properties: {
    _id: 'objectId?',
    cost: 'int?',
    description: 'string?',
    imgId: 'int?',
    maxDamage: 'int?',
    minDamage: 'int?',
    name: 'string?',
    requirements: 'IPlayer_equipment_mainHand_requirements',
  },
};

export type IPlayer_equipment_mainHand_requirements = {
  con?: number;
  dex?: number;
  int?: number;
  str?: number;
};

export const IPlayer_equipment_mainHand_requirementsSchema = {
  name: 'IPlayer_equipment_mainHand_requirements',
  embedded: true,
  properties: {
    con: 'int?',
    dex: 'int?',
    int: 'int?',
    str: 'int?',
  },
};


export const IPlayer_inventorySchema = {
  name: 'IPlayer_inventory',
  embedded: true,
  properties: {},
};

export type IShopWeapon = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  description: string;
  grade: string;
  imgId: number;
  maxDamage: number;
  minDamage: number;
  name: string;
  requirements: IShopWeapon_requirements;
  sale: boolean;
};

export const IShopWeaponSchema = {
  name: 'IShopWeapon',
  properties: {
    _id: 'objectId',
    cost: 'int',
    description: 'string',
    grade: 'string',
    imgId: 'int',
    maxDamage: 'int',
    minDamage: 'int',
    name: 'string',
    requirements: 'IShopWeapon_requirements',
  },
  primaryKey: '_id',
};

export type IShopWeapon_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};

export const IShopWeapon_requirementsSchema = {
  name: 'IShopWeapon_requirements',
  embedded: true,
  properties: {
    con: 'int?',
    dex: 'int?',
    int: 'int?',
    str: 'int?',
  },
};

export type IWeapon = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  description: string;
  grade: string;
  imgId: number;
  maxDamage: number;
  minDamage: number;
  name: string;
  requirements: IWeapon_requirements;
  sale?: boolean;
};

export const IWeaponSchema = {
  name: 'IWeapon',
  properties: {
    _id: 'objectId',
    cost: 'int',
    description: 'string',
    grade: 'string',
    imgId: 'int',
    maxDamage: 'int',
    minDamage: 'int',
    name: 'string',
    requirements: 'IWeapon_requirements',
    sale: 'bool?',
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
