import * as Realm from 'realm-web';
import { IBoots, IShopBoots } from "../types/types";


const app = Realm.App.getApp('application-0-vgvqx');


export const getCreateBoots = async (boots: IShopBoots): Promise<IBoots | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const bootsCollection = mongodb.db("bots_rpg").collection<IBoots>("boots");

    try {
        if (boots !== undefined) {
            // Create a new unique boots in the database
            const newBoots: IBoots = {
                _id: new Realm.BSON.ObjectId(),
                cost: boots.cost,
                description: boots.description,
                grade: boots.grade,
                imgId: boots.imgId,
                defense: boots.stats.defense,
                name: boots.name,
                requirements: boots.requirements,
            };

            await bootsCollection.insertOne(newBoots);
            // Return the new weapon including its generated _id
            return newBoots;
        } else {
            console.error("No boots to create.");
        }
    } catch (err) {
        console.error("Failed to create armor:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}