import * as Realm from 'realm-web';
import { IItem, IPlayer } from '../types/types';


const app = Realm.App.getApp('application-0-vgvqx');


export const getSaleItem = async (item: IItem, player: IPlayer, updatePlayerData: (updates: Partial<IPlayer>) => Promise<void>, quantity?: number): Promise<boolean | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const itemCollection = mongodb.db("bots_rpg").collection<IItem>("items");
    const findItemInInventory: number = player.inventory.items.findIndex((i: IItem) => i._id !== item._id);

    if (player.inventory[findItemInInventory].quantity && quantity) {
        const newQuantityValue = player.inventory[findItemInInventory]?.quantity - quantity;

        console.log('newValue', newQuantityValue);
        try {
            if (newQuantityValue <= 0) {
                // if sold all quantity remove item.
                updatePlayerData({
                    ...player,
                    gold: player.gold + (item.cost * quantity),
                    inventory: {
                        ...player.inventory,
                        items: player.inventory.items.filter((i: IItem) => i._id !== item._id)
                    }
                })
            } else {
                updatePlayerData({
                    ...player,
                    gold: player.gold + (item.cost * quantity),
                    inventory: {
                        ...player.inventory,
                        items: player.inventory[findItemInInventory].quantity = newQuantityValue
                    }
                })
            }
        } catch (err) {
            console.error("Failed to sale item:", err);
            throw err; // Rethrow the error for the calling function to handle
        }
    }


}