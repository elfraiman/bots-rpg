import * as Realm from 'realm-web';
import { IItem } from '../types/types';
import { getMongoClient } from '../mongoClient';

const GetBaseItem = async (_id: Realm.BSON.ObjectId) => {
    const client = getMongoClient();

    if (!client) {
        console.error("No client found");
        return;
    }

    const itemsCollection = client.db("bots_rpg").collection<IItem>("items");

    try {
        if (_id !== undefined) {
            const baseItem = await itemsCollection.findOne({ _id });

            return baseItem;
        } else {
            console.error("Cant find trash");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to create trash:", err);
        throw err; // Rethrow the error for the calling function to handle
    }

}


export default GetBaseItem;