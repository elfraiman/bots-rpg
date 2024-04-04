import * as Realm from 'realm-web';
import { IPlayerOwnedArmor, IPlayer, IPlayerEquipment } from "../types/types";


const app = Realm.App.getApp('application-0-vgvqx');


export const GetSalePlayerEquipment = async (armor: IPlayerOwnedArmor, player: IPlayer, updatePlayerData: any): Promise<boolean | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const playerEquipmentsCollections = mongodb.db("bots_rpg").collection<IPlayerEquipment>("playerEquipments");

    try {
        if (armor !== undefined && player) {
            await playerEquipmentsCollections.deleteOne({ _id: armor._id });
            // Correctly filter out the sold armor using .equals() for ObjectId comparison
            const updatedInventory = player.inventory.filter((itemId: Realm.BSON.ObjectId) => !itemId.equals(armor._id));

            await updatePlayerData({
                ...player,
                gold: player.gold + (armor.cost / 2),
                inventory: updatedInventory
            });
            return true;
        } else {
            console.error("Cant delete armor");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to create armor:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}