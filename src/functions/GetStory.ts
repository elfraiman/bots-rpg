import * as Realm from 'realm-web';
import { IStory } from "../types/types";

const app = Realm.App.getApp('application-0-vgvqx');


export const GetStory = async (storyStep: number): Promise<IStory | null> => {
  if (!app.currentUser) {
    throw new Error("No current user found. Ensure you're logged in to Realm.");
  }
  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const storiesCollection = mongodb.db("bots_rpg").collection<IStory>("stories");

  try {
    // No need for instanceof checks. Use the type property directly;
    const story = await storiesCollection.findOne({ storyStep });
    // Return the base equipment including its generated _id
    return story;
  } catch (err) {
    console.error(`Failed to find story:`, err);
    throw err;
  }
}
