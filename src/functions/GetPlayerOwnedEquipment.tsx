import * as Realm from 'realm-web';
import { IPlayerEquipment } from "../types/types";

const app = Realm.App.getApp('application-0-vgvqx');


export const GetPlayerOwnedEquipment = async (
    playerId: string,
    equipmentId: Realm.BSON.ObjectId,
): Promise<IPlayerEquipment | null> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const playerEquipments = mongodb.db("bots_rpg").collection<IPlayerEquipment>("playerEquipments");

    try {
        // No need for instanceof checks. Use the type property directly;

        const ownedEquipment = await playerEquipments.findOne({_id: equipmentId, ownerId: playerId });
        // Return the new equipment including its generated _id
        return ownedEquipment;
    } catch (err) {
        console.error(`Failed to find ${equipmentId}:`, err);
        throw err;
    }
}
