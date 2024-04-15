import { getMongoClient } from "../mongoClient";
import { IPlayer } from "../types/types";

const getPlayers = async () => {
  const client = getMongoClient();

  if (!client) {
    console.error("No client found");
    return;
  }

  const playersCollection = client.db("bots_rpg").collection<IPlayer>("players");


  try {
    const allPlayers = await playersCollection.find({});

    return allPlayers;
  } catch (e) {
    throw (e);
  }

}


export const checkNameIsValid = async (name: string) => {
  const client = getMongoClient();

  if (!client) {
    console.error("No client found");
    return;
  }


  const playersCollection = client.db("bots_rpg").collection<IPlayer>("players");


  try {
    const player = await playersCollection.findOne({ name });

    return player;
  } catch (e) {
    throw (e);
  }

}

export default getPlayers;