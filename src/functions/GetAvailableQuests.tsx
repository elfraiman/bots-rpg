import * as Realm from 'realm-web';
import { IQuest } from "../types/types";

const app = Realm.App.getApp('application-0-vgvqx');


export const GetAvailableQuests = async (location: Realm.BSON.ObjectId): Promise<IQuest[] | null> => {
  if (!app.currentUser) {
    throw new Error("No current user found. Ensure you're logged in to Realm.");
  }

  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const questsCollection = mongodb.db("bots_rpg").collection<IQuest>("quests");

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
