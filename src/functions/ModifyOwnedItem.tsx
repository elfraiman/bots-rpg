import * as Realm from 'realm-web';
import { getMongoClient } from '../mongoClient';
import { IPlayerItem } from '../types/types';



const modifyOwnedItem = async (_id: Realm.BSON.ObjectId, quantity?: number) => {
    const client = getMongoClient();

    if (!client) {
        console.error("No client found");
        return;
    }

    const playerItemsCollection = client.db("bots_rpg").collection<IPlayerItem>("playerItems");

    try {
        if (_id !== undefined) {
            const increaseAmount = quantity ?? 1;
            const playerOwnedItem = await playerItemsCollection.updateOne(
                { _id: _id },
                { $inc: { quantity: increaseAmount } }
            );

            return playerOwnedItem;
        } else {
            console.error("Cant find trash");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to create trash:", err);
        throw err;
    }

}


export default modifyOwnedItem;