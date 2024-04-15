import * as Realm from 'realm-web';
import { IQuest } from "../types/types";
import { getMongoClient } from '../mongoClient';



export const GetAvailableQuests = async (location: Realm.BSON.ObjectId): Promise<IQuest[] | null> => {
  const client = getMongoClient();

  if (!client) {
    console.error("No client found");
    return null;
  }

  const questsCollection = client.db("bots_rpg").collection<IQuest>("quests");

  try {
    // No need for instanceof checks. Use the type property directly;
    const questList = await questsCollection.find({ location });
    // Return the base equipment including its generated _id
    return questList;

  } catch (err) {
    console.error(`Failed to find quests:`, err);
    throw err;
  }
}
