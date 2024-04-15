import toast from 'react-hot-toast';
import * as Realm from 'realm-web';
import { getMongoClient } from '../mongoClient';
import { IPlayer, IPlayerItem } from "../types/types";
import GetBaseItem from './GetBaseItem';
import modifyOwnedItem from './ModifyOwnedItem';

export const createPlayerOwnedItem = async (
    player: IPlayer,
    itemId: Realm.BSON.ObjectId,
    quantity?: number,
): Promise<IPlayerItem | undefined> => {
    const client = getMongoClient();

    if (!client) {
        console.error("No client found");
        return;
    }

    const playerItems = client.db("bots_rpg").collection<IPlayerItem>("playerItems");

    try {
        const itemAlreadyOwned = await playerItems.findOne({ baseItemId: itemId, ownerId: player._id });
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
            await modifyOwnedItem(itemAlreadyOwned._id, quantity);
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
