import { IPlayer } from "../types/types";
import * as Realm from 'realm-web';

// Assuming you've properly initialized the Realm app outside of this component
const app = Realm.App.getApp('application-0-vgvqx');


const GetPlayers = async () => {
  if (!app.currentUser) {
    console.error("No current user found");
    return;
  }

  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const playersCollection = mongodb.db("bots_rpg").collection<IPlayer>("players");


  try {
    const allPlayers = await playersCollection.find({});

    return allPlayers;
  } catch (e) {
    throw (e);
  }

}

export default GetPlayers;