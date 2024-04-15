import * as Realm from 'realm-web';
import { IPlayerEquipment } from "../types/types";
import { getMongoClient } from '../mongoClient';

export const getPlayerOwnedEquipment = async (
    playerId: string,
    equipmentId: Realm.BSON.ObjectId,
): Promise<IPlayerEquipment | null> => {
    const client = getMongoClient();

    if (!client) {
        console.error("No client found");
        return null;
    }

    const playerEquipments = client.db("bots_rpg").collection<IPlayerEquipment>("playerEquipments");

    try {
        // No need for instanceof checks. Use the type property directly;

        const ownedEquipment = await playerEquipments.findOne({ _id: equipmentId, ownerId: playerId });
        // Return the new equipment including its generated _id
        return ownedEquipment;
    } catch (err) {
        console.error(`Failed to find ${equipmentId}:`, err);
        throw err;
    }
}
