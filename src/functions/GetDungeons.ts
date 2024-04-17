import * as Realm from 'realm-web';
import { getMongoClient } from "../mongoClient";
import { IDungeon } from "../types/types";


export const getDungeons = async (location: Realm.BSON.ObjectId): Promise<IDungeon[] | undefined> => {
  const client = getMongoClient();

  if (!client) {
    console.error("No client found");
    return;
  }

  const dungeonCollection = client.db("bots_rpg").collection<IDungeon>("dungeons");

  try {
    if (location !== undefined) {
      const dungeons = await dungeonCollection.find({ location: location });
      return dungeons ?? undefined;
    }
  } catch (err) {
    console.error("Failed to fetch enemies data:", err);
  }
}


export const getDungeon = async (_id: string): Promise<IDungeon | undefined> => {
  const client = getMongoClient();

  if (!client) {
    console.error("No client found");
    return;
  }

  const dungeonCollection = client.db("bots_rpg").collection<IDungeon>("dungeons");

  try {
    if (_id !== undefined) {
      const dungeon = await dungeonCollection.findOne({ _id: new Realm.BSON.ObjectId(_id) });
      return dungeon ?? undefined;
    }
  } catch (err) {
    console.error("Failed to fetch enemies data:", err);
  }
}