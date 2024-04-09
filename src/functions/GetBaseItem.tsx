import * as Realm from 'realm-web';
import { IItem } from '../types/types';


const app = Realm.App.getApp('application-0-vgvqx');




const GetBaseItem = async (_id: Realm.BSON.ObjectId) => {

    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const itemsCollection = mongodb.db("bots_rpg").collection<IItem>("items");

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