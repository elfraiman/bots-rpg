import * as Realm from 'realm-web';
import { getMongoClient } from '../mongoClient';
import { IEquipment, IPlayer, IPlayerEquipment } from "../types/types";

export const SellPlayerEquipment = async (equipment: IEquipment, player: IPlayer, updatePlayerData: any): Promise<boolean | undefined> => {
    const client = getMongoClient();

    if (!client) {
        console.error("No client found");
        return;
    }

    const playerEquipmentsCollections = client.db("bots_rpg").collection<IPlayerEquipment>("playerEquipments");

    try {
        if (equipment !== undefined && player) {
            await playerEquipmentsCollections.deleteOne({ _id: equipment._id });

            const updatedEquipInventory = player.equipmentInventory.filter((itemId: Realm.BSON.ObjectId) => !itemId.equals(equipment._id));

            await updatePlayerData({
                ...player,
                gold: player.gold + (equipment.cost / 2.5),
                equipmentInventory: updatedEquipInventory
            });
            return true;
        } else {
            console.error("Cant delete equipment");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to sell equipment:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}