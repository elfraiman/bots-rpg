import * as Realm from 'realm-web';
import { IEquipment } from "../types/types";
import { getMongoClient } from '../mongoClient';

export const GetBaseEquipment = async (
    baseItemId: Realm.BSON.ObjectId,
): Promise<IEquipment | null> => {
    const client = getMongoClient();

    if (!client) {
        console.error("No client found");
        return null;
    }

    const playerEquipments = client.db("bots_rpg").collection<IEquipment>("armors");

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
