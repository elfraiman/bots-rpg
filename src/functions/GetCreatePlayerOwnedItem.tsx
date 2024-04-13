import * as Realm from 'realm-web';
import { IItem, IPlayer, IPlayerItem } from "../types/types";
import GetModifyOwnedItem from './GetModifyBaseItem';
import GetBaseItem from './GetBaseItem';
import toast from 'react-hot-toast';

const app = Realm.App.getApp('application-0-vgvqx');

export const GetCreatePlayerOwnedItem = async (
    player: IPlayer,
    itemId: Realm.BSON.ObjectId,
    quantity?: number,
): Promise<IPlayerItem | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const playerItems = mongodb.db("bots_rpg").collection<IPlayerItem>("playerItems");

    try {
        const itemAlreadyOwned = await playerItems.findOne({ baseItemId: itemId, ownerId: app.currentUser.id });
        const baseItem = await GetBaseItem(itemId);

        const displayToast = async () => {
            toast(`+ ${quantity} ${baseItem?.name}`, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        };

        if (itemAlreadyOwned) {
            await GetModifyOwnedItem(itemAlreadyOwned._id, quantity);
            await displayToast();
            return itemAlreadyOwned;
        } else {
            // Create a new unique item in the database
            const newItem: IPlayerItem = {
                _id: new Realm.BSON.ObjectId(),
                baseItemId: itemId,
                ownerId: player._id,
                quantity: quantity ?? 1,
            };
            await playerItems.insertOne(newItem);
            await displayToast();
            return newItem;
        }
    } catch (err: any) {
        console.error(`Failed to create or modify item ${itemId}:`, err);
        throw new Error(`Failed to create or modify item: ${err.message}`);
    }
}
