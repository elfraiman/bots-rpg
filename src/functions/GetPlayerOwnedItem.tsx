import * as Realm from 'realm-web';
import { IItem, IPlayerItem } from '../types/types';


const app = Realm.App.getApp('application-0-vgvqx');




const GetPlayerOwnedItem = async (_id: Realm.BSON.ObjectId) => {

    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const playerOwnedItemsCollection = mongodb.db("bots_rpg").collection<IPlayerItem>("playerItems");

    try {
        if (_id !== undefined) {
            const playerOwnedItem = await playerOwnedItemsCollection.findOne({ _id });

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