import { getMongoClient } from '../mongoClient';
import { IStory } from "../types/types";


export const GetStory = async (storyStep: number): Promise<IStory | null> => {
  const client = getMongoClient();

  if (!client) {
    console.error("No client found");
    return null;
  }

  const storiesCollection = client.db("bots_rpg").collection<IStory>("stories");

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
