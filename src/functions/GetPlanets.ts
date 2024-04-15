import { getMongoClient } from "../mongoClient";
import { IPlanet } from "../types/types";



export const getPlanets = async (): Promise<IPlanet[] | undefined> => {
  const client = getMongoClient();

  if (!client) {
    console.error("No client found");
    return;
  }

  const planetsCollections = client.db("bots_rpg").collection<IPlanet>("planets");

  try {
    if (location !== undefined) {
      const planet = await planetsCollections.find();
      console.log("Querying with _id:", location);
      return planet;
    } else {

      console.log("No query parameters provided.");
      return;
    }
  } catch (err) {
    console.error("Failed to fetch enemies data:", err);
  }
}
