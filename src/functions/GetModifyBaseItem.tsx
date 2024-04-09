import * as Realm from 'realm-web';
import { IItem, IPlayerItem } from '../types/types';


const app = Realm.App.getApp('application-0-vgvqx');




const GetModifyOwnedItem = async (_id: Realm.BSON.ObjectId, quantity?: number) => {

    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const playerItemsCollection = mongodb.db("bots_rpg").collection<IPlayerItem>("playerItems");

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
        throw err; // Rethrow the error for the calling function to handle
    }

}


export default GetModifyOwnedItem;