import toast from 'react-hot-toast';
import * as Realm from 'realm-web';
import { IPlayer, IPlayerOwnedItem } from '../types/types';


const app = Realm.App.getApp('application-0-vgvqx');


export const getSellItem = async (item: IPlayerOwnedItem, quantityToSell: number, updatePlayerData: (updates: Partial<IPlayer>) => Promise<void>, player: IPlayer) => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }
    if (!player) return;


    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const playerOwnedItemsCollection = mongodb.db("bots_rpg").collection<IPlayerOwnedItem>("playerItems");


    if (playerOwnedItemsCollection && quantityToSell) {
        try {
            const gold = (quantityToSell * item.cost)
            if (item.quantity == quantityToSell) {
                await playerOwnedItemsCollection.deleteOne({ _id: item._id }).then(async () => {

                    await updatePlayerData({
                        ...player,
                        inventory: player.inventory.filter(i => i.toString() !== item._id.toString()),
                        gold: player.gold + gold
                    });
                });
            } else {
                await playerOwnedItemsCollection.updateOne({ _id: item._id }, { $inc: { quantity: -quantityToSell } }).then(async () => {

                    await updatePlayerData({
                        ...player,
                        gold: player.gold + gold,
                        inventory: player.inventory
                    });
                })
            }

            toast(`+ ${quantityToSell * item.cost} 🪙`,
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );

        } catch (e) {
            console.error('Error selling player owned items');
        }

    }
}