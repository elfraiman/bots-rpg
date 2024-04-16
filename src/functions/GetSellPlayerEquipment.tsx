import * as Realm from 'realm-web';
import { getMongoClient } from '../mongoClient';
import { IEquipment, IPlayer, IPlayerEquipment } from "../types/types";
import { BASE_EQUIPMENT_SALE_PRICE } from '../types/stats';

/**
 * Sales an equipment and returns the gold added to the player
 * @param equipment
 * @param player
 * @param updatePlayerData
 * @returns
 */
export const SellPlayerEquipment = async (equipment: IEquipment, player: IPlayer, updatePlayerData: any): Promise<number | undefined> => {
    const client = getMongoClient();

    if (!client) {
        console.error("No client found");
        return;
    }

    const playerEquipmentsCollections = client.db("bots_rpg").collection<IPlayerEquipment>("playerEquipments");

    try {
        if (equipment !== undefined && player) {
            let value = Math.round(equipment.cost * (1 - BASE_EQUIPMENT_SALE_PRICE));

            await playerEquipmentsCollections.deleteOne({ _id: equipment._id });

            const updatedEquipInventory = player.equipmentInventory.filter((itemId: Realm.BSON.ObjectId) => !itemId.equals(equipment._id));

            await updatePlayerData({
                gold: player.gold + value,
                equipmentInventory: updatedEquipInventory
            });

            return value;
        } else {
            console.error("Cant delete equipment");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to sell equipment:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}