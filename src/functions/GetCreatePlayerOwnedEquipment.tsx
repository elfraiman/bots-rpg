import * as Realm from 'realm-web';
import { getMongoClient } from '../mongoClient';
import { IEquipment, IPlayer, IPlayerEquipment } from "../types/types";

export const GetCreatePlayerOwnedEquipment = async (
    player: IPlayer,
    equipment: IEquipment,
    updatePlayerData: (updates: Partial<IPlayer>) => Promise<void>,
): Promise<IPlayerEquipment | undefined> => {
    const client = getMongoClient();

    if (!client) {
        console.error("No client found");
        return;
    }

    const playerEquipments = client.db("bots_rpg").collection<IPlayerEquipment>("playerEquipments");

    try {
        // No need for instanceof checks. Use the type property directly.
        const itemType = equipment.type;

        // Create a new unique equipment in the database
        const newEquipment: IPlayerEquipment = {
            _id: new Realm.BSON.ObjectId(),
            baseItemId: equipment._id,
            itemType: itemType,
            ownerId: player._id,
            modifications: {
                enhancementLevel: 0
            }
        };

        await playerEquipments.insertOne(newEquipment);

        // Return the new equipment including its generated _id
        updatePlayerData({
            gold: player.gold - equipment.cost,
            equipmentInventory: [...player.equipmentInventory, newEquipment._id]
        });

        return newEquipment;
    } catch (err) {
        console.error(`Failed to create ${equipment.type}:`, err);
        throw err;
    }
}
