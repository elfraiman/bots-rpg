import * as Realm from 'realm-web';
import { IArmor, IShopArmor } from "../types/types";


const app = Realm.App.getApp('application-0-vgvqx');


export const getCreateArmor = async (armor: IShopArmor): Promise<IArmor | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const armorsCollection = mongodb.db("bots_rpg").collection<IArmor>("armors");

    try {
        if (armor !== undefined) {
            // Create a new unique armor in the database
            const newArmor: IArmor = {
                _id: new Realm.BSON.ObjectId(),
                cost: armor.cost,
                description: armor.description,
                grade: armor.grade,
                imgId: armor.imgId,
                defense: armor.defense,
                name: armor.name,
                requirements: armor.requirements,
            };
            
            await armorsCollection.insertOne(newArmor);
            // Return the new weapon including its generated _id
            return newArmor;
        } else {
            console.error("No armor to create.");
        }
    } catch (err) {
        console.error("Failed to create armor:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}