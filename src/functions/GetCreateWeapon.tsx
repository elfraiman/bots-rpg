import * as Realm from 'realm-web';
import { IWeapon } from "../types/types";


const app = Realm.App.getApp('application-0-vgvqx');


export const getCreateWeapon = async (weapon: IWeapon): Promise<IWeapon | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const weaponsCollection = mongodb.db("bots_rpg").collection<IWeapon>("weapons");

    try {
        if (weapon !== undefined) {
            // Create a new unique weapon in the database
            const newWeapon: IWeapon = {
                _id: new Realm.BSON.ObjectId(),
                cost: weapon.cost,
                description: weapon.description,
                grade: weapon.grade,
                imgId: weapon.imgId,
                maxDamage: weapon.maxDamage,
                minDamage: weapon.minDamage,
                name: weapon.name,
                requirements: weapon.requirements,
                // You could add more fields here based on your IWeapon type
            };
            
            await weaponsCollection.insertOne(newWeapon);
            // Return the new weapon including its generated _id
            return newWeapon;
        } else {
            console.error("No weapon to create.");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to create weapon:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}