import * as Realm from 'realm-web';
import { IHelmet, IShopHelmet } from "../types/types";


const app = Realm.App.getApp('application-0-vgvqx');


export const getCreateHelmet = async (helmet: IShopHelmet): Promise<IHelmet | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const helmetsCollection = mongodb.db("bots_rpg").collection<IHelmet>("helmets");

    try {
        if (helmet !== undefined) {
            // Create a new unique helmet in the database
            const newHelmet: IHelmet = {
                _id: new Realm.BSON.ObjectId(),
                cost: helmet.cost,
                description: helmet.description,
                grade: helmet.grade,
                imgId: helmet.imgId,
                defense: helmet.defense,
                name: helmet.name,
                requirements: helmet.requirements,
            };

            await helmetsCollection.insertOne(newHelmet);
            // Return the new weapon including its generated _id
            return newHelmet;
        } else {
            console.error("No helmet to create.");
        }
    } catch (err) {
        console.error("Failed to create armor:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}