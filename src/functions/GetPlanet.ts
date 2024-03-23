import { IPlanet } from "../types/types";
import * as Realm from 'realm-web';


const app = Realm.App.getApp('application-0-vgvqx');


export const getSinglePlanet = async (location: string): Promise<IPlanet | undefined> => {
    if (!app.currentUser) {
      console.error("No current user found. Ensure you're logged in to Realm.");
      return;
    }
  
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const planetsCollections = mongodb.db("bots_rpg").collection<IPlanet>("planets");
  
    try {
      if (location !== undefined) {
    // Use findOne() for _id queries as it's more efficient for sngle document retrieval
        const planet = await planetsCollections.findOne({ name: location });
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
  