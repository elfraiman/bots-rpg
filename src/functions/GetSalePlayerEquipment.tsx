import * as Realm from 'realm-web';
import { IPlayerOwnedArmor, IPlayer, IPlayerEquipment, IEquipment } from "../types/types";


const app = Realm.App.getApp('application-0-vgvqx');


export const GetSalePlayerEquipment = async (equipment: IEquipment, player: IPlayer, updatePlayerData: any): Promise<boolean | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const playerEquipmentsCollections = mongodb.db("bots_rpg").collection<IPlayerEquipment>("playerEquipments");

    try {
        if (equipment !== undefined && player) {
            await playerEquipmentsCollections.deleteOne({ _id: equipment._id });
            // Correctly filter out the sold armor using .equals() for ObjectId comparison
            const updatedEquipInventory = player.equipmentInventory.filter((itemId: Realm.BSON.ObjectId) => !itemId.equals(equipment._id));

            await updatePlayerData({
                ...player,
                gold: player.gold + (equipment.cost / 2),
                equipmentInventory: updatedEquipInventory
            });
            return true;
        } else {
            console.error("Cant delete equipment");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to create equipment:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}