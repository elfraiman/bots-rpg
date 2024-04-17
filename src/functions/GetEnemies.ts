import * as Realm from "realm-web";
import { getMongoClient } from "../mongoClient";
import { IEnemy } from "../types/types";

interface IGetEnemiesProps {
  location?: Realm.BSON.ObjectId;
  monsterId?: string; // Use string type assuming _id is a string in your schema
}

export const getEnemies = async ({ location }: IGetEnemiesProps): Promise<IEnemy[] | undefined> => {
  const client = getMongoClient();

  if (!client) {
    console.error("No client found");
    return;
  }
  const enemiesCollection = client.db("bots_rpg").collection<IEnemy>("enemies");

  try {
    if (location) {
      // Use find() for location queries to get all matching documents
      const enemiesResult = await enemiesCollection.find({ location });

      console.log("Querying with location:", location);

      return enemiesResult;
    } else {
      // Optionally handle the case where neither _id nor location is provided
      console.log("No query parameters provided.");
      return undefined;
    }
  } catch (err) {
    console.error("Failed to fetch enemies data:", err);
  }
}


export const getSingleEnemy = async ({ monsterId }: IGetEnemiesProps): Promise<IEnemy | undefined> => {
  const client = getMongoClient();

  if (!client) {
    console.error("No client found");
    return;
  }

  const enemiesCollection = client.db("bots_rpg").collection<IEnemy>("enemies");

  try {
    if (monsterId !== undefined) {
      // Use findOne() for _id queries as it's more efficient for single document retrieval
      const enemy = await enemiesCollection.findOne({ _id: new Realm.BSON.ObjectId(monsterId) });
      return enemy ?? undefined;
    } else {
      // Optionally handle the case where neither _id nor location is provided
      console.log("No query parameters provided.");
      return undefined;
    }
  } catch (err) {
    console.error("Failed to fetch enemies data:", err);
  }
}


export const getDungeonEnemies = async (dungeonId: string): Promise<IEnemy[] | undefined> => {
  const client = getMongoClient();

  if (!client) {
    console.error("No client found");
    return;
  }

  const enemiesCollection = client.db("bots_rpg").collection<IEnemy>("enemies");

  try {
    // Use find() for dungeonId queries to get all matching documents
    const enemiesResult = await enemiesCollection.find({ dungeonId });

    console.log("Querying with dungeonId:", dungeonId);

    return enemiesResult;
  } catch (err) {
    console.error("Failed to fetch enemies data:", err);
  }
}