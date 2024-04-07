import * as Realm from 'realm-web';
import { IPlayer, IPlayerOwnedItem } from '../types/types';


const app = Realm.App.getApp('application-0-vgvqx');


export const getSaleItem = async (item: IPlayerOwnedItem, quantityToSell: number, updatePlayerData: (updates: Partial<IPlayer>) => Promise<void>, player: IPlayer) => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }
    if (!player) return;

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const playerOwnedItemsCollection = mongodb.db("bots_rpg").collection<IPlayerOwnedItem>("playerItems");


    if (playerOwnedItemsCollection && quantityToSell) {


        try {
            if (item.quantity == quantityToSell) {
                await playerOwnedItemsCollection.deleteOne({ _id: item._id });
            } else {
                await playerOwnedItemsCollection.updateOne({ _id: item._id }, { $inc: { quantity: -quantityToSell } })
            }

            await updatePlayerData({
                ...player,
                gold: player.gold + (quantityToSell * item.cost)
            });

        } catch (e) {
            console.error('Error selling player owned items');
        }


    }
}