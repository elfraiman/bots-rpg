import { getMongoClient } from "../mongoClient";
import { IPlanet } from "../types/types";
import * as Realm from 'realm-web';


export const getSinglePlanet = async (location: Realm.BSON.ObjectId): Promise<IPlanet | undefined> => {
  const client = getMongoClient();

  if (!client) {
    console.error("No client found");
    return;
  }

  const planetsCollections = client.db("bots_rpg").collection<IPlanet>("planets");

  try {
    if (location !== undefined) {
      // Use findOne() for _id queries as it's more efficient for sngle document retrieval
      const planet = await planetsCollections.findOne({ _id: location });
      console.log("Querying with _id:", location);
      return planet ?? undefined;
    } else {

      console.log("No query parameters provided.");
      return undefined;
    }
  } catch (err) {
    console.error("Failed to fetch enemies data:", err);
  }
}
