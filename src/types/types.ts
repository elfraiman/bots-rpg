import * as Realm from "realm-web";

export type IEnemy = {
  _id: Realm.BSON.ObjectId;
  armorLoot: Array<Realm.BSON.ObjectId>;
  bootsLoot: Array<Realm.BSON.ObjectId>;
  con: number;
  description: string;
  dex: number;
  equipment?: IEnemy_equipment;
  helmetLoot: Array<Realm.BSON.ObjectId>;
  imgId: number;
  int: number;
  level: number;
  location: string;
  name: string;
  str: number;
  trashLoot: Realm.BSON.ObjectId;
  type: string;
  weaponLoot: Array<Realm.BSON.ObjectId>;
};


export type IItem = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  description: string;
  grade?: string;
  imgId: number;
  name: string;
  type?: string;
};



export type IPlayerOwnedItem = {
  _id: Realm.BSON.ObjectId;
  baseItemId: Realm.BSON.ObjectId;
  ownerId: string;
  quantity: number;
  cost: number;
  description: string;
  grade?: string;
  imgId: number;
  name: string;
  type?: string;
};

export type IPlayerItem = {
  _id: Realm.BSON.ObjectId;
  baseItemId: Realm.BSON.ObjectId;
  ownerId: string;
  quantity: number;
};

export type IPlayerEquipment = {
  _id: Realm.BSON.ObjectId;
  baseItemId: Realm.BSON.ObjectId;
  itemType: string;
  modifications?: IPlayerEquipment_modifications;
  ownerId: string;
};

export type IPlayerEquipment_modifications = {
  enhancementLevel?: number;
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

export type IEnemy_equipment = {
  weapon: IEnemy_equipment_weapon;
};

export type IEnemy_equipment_weapon = {
  name: string;
  stats: IEnemy_equipment_weapon_stats;
};

export type IEnemy_equipment_weapon_stats = {
  maxAttack: number;
  minAttack: number;
};


export type IEnemy_equipment_mainHand = {
  maxDamage?: number;
  minDamage?: number;
  name?: string;
};


export type IEquipment = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  description: string;
  forSale: boolean;
  grade: string;
  imgId: number;
  name: string;
  requirements: IEquipment_requirements;
  sale?: boolean;
  stats?: IEquipment_stats;
  type: string;
};

export type IEquipment_requirements = {
  con: number;
  dex: number;
  int: number;
  str: number;
};

export type IEquipment_stats = {
  defense?: number;
  evasion?: number;
  maxAttack?: number;
  minAttack?: number;
  modifier?: string;
};

export type IArmor = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  description: string;
  grade: string;
  imgId: number;
  name: string;
  requirements: IArmor_requirements;
  forSale?: boolean;
  stats: IArmor_stats;
  type: string;
};

export type IArmor_stats = {
  defense: number;
  evasion: number;
  modifier: string;
};

export type IPlayerOwnedArmor = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  stats: IArmor_stats;
  description: string;
  grade: string;
  imgId: number;
  name: string;
  requirements: IArmor_requirements;
  sale?: boolean;
  type: string;
  baseItemId: Realm.BSON.ObjectId;
  itemType: string;
  modifications?: IPlayerEquipment_modifications;
  ownerId: string;
}

export type IPlayerOwnedWeapon = {
  _id: Realm.BSON.ObjectId;
  cost: number;
  stats: IWeapon_stats;
  description: string;
  grade: string;
  imgId: number;
  name: string;
  requirements: IWeapon_requirements;
  sale?: boolean;
  type: string;
  baseItemId: Realm.BSON.ObjectId;
  itemType: string;
  modifications?: IPlayerEquipment_modifications;
  ownerId: string;
}


export type IArmor_requirements = {
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
  inventory: Realm.BSON.ObjectId[];
  equipmentInventory: Realm.BSON.ObjectId[];
  level: number;
  location: string;
  name: string;
  str: number;
};

export type IPlayer_equipment = {
  armor?: Realm.BSON.ObjectId;
  boots?: Realm.BSON.ObjectId;
  helmet?: Realm.BSON.ObjectId;
  weapon?: Realm.BSON.ObjectId;
};


export type IPlayer_equipment_armor = {
  _id?: Realm.BSON.ObjectId;
  cost?: number;
  defense?: number;
  description?: string;
  imgId?: number;
  name?: string;
  requirements?: IPlayer_equipment_armor_requirements;
  grade?: string;
};
export type IEquippedItemsDetails = {
  armor?: IPlayer_equipment_armor;
  helmet?: IPlayer_equipment_armor;
  boots?: IPlayer_equipment_armor;
}


export const IPlayer_equipmentSchema = {
  name: 'IPlayer_equipment',
  embedded: true,
  properties: {
    mainHand: 'IPlayer_equipment_mainHand',
  },
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
  type: string;
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
  name: string;
  requirements: IWeapon_requirements;
  forSale?: boolean;
  stats?: IWeapon_stats;
  type?: string;
};
export type IWeapon_stats = {
  maxAttack: number;
  minAttack: number;
  modifier: string;
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
