import * as Realm from 'realm-web';
import { getMongoClient } from '../mongoClient';
import { IPlayerItem } from '../types/types';



const GetPlayerOwnedItem = async (_id: Realm.BSON.ObjectId, ownerId: string) => {
    const client = getMongoClient();

    if (!client) {
        console.error("No client found");
        return;
    }

    const playerOwnedItemsCollection = client.db("bots_rpg").collection<IPlayerItem>("playerItems");

    try {
        if (_id !== undefined) {
            const playerOwnedItem = await playerOwnedItemsCollection.findOne({ _id, ownerId: ownerId });

            return playerOwnedItem;
        } else {
            console.error("Cant find trash");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to create trash:", err);
        throw err; // Rethrow the error for the calling function to handle
    }

}


export default GetPlayerOwnedItem;