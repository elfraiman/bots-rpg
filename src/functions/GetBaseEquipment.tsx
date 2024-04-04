import * as Realm from 'realm-web';
import { IEquipment } from "../types/types";

const app = Realm.App.getApp('application-0-vgvqx');


export const GetBaseEquipment = async (
    baseItemId: Realm.BSON.ObjectId,
): Promise<IEquipment | null> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const playerEquipments = mongodb.db("bots_rpg").collection<IEquipment>("armors");

    try {
        // No need for instanceof checks. Use the type property directly;
        const baseArmor = await playerEquipments.findOne({ _id: baseItemId });
        // Return the base equipment including its generated _id
        return baseArmor;

    } catch (err) {
        console.error(`Failed to find ${baseItemId}:`, err);
        throw err;
    }
}
