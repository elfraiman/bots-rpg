import * as Realm from "realm-web";
import { IEnemy } from "../types/types";

interface IGetEnemiesProps {
  location?: string;
  monsterId?: string; // Use string type assuming _id is a string in your schema
}

const app = Realm.App.getApp('application-0-vgvqx');

const getEnemies = async ({ location, monsterId }: IGetEnemiesProps): Promise<IEnemy[] | IEnemy | undefined> => {
  if (!app.currentUser) {
    console.error("No current user found. Ensure you're logged in to Realm.");
    return;
  }

  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const enemiesCollection = mongodb.db("bots_rpg").collection<IEnemy>("enemies");

  try {
    if (monsterId !== undefined) {
      // Use findOne() for _id queries as it's more efficient for single document retrieval
      const enemy = await enemiesCollection.findOne({ _id: new Realm.BSON.ObjectId(monsterId) });
      console.log("Querying with _id:", monsterId);
      return enemy ?? undefined;
    } else if (location) {
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

export default getEnemies;
