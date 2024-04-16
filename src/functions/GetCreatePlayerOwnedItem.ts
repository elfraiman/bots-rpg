import toast from 'react-hot-toast';
import * as Realm from 'realm-web';
import { getMongoClient } from '../mongoClient';
import { IPlayer, IPlayerItem } from "../types/types";
import GetBaseItem from './GetBaseItem';
import modifyOwnedItem from './ModifyOwnedItem';
import { COMMON_ITEM_DROP_AMOUNT, EPIC_ITEM_DROP_AMOUNT, RARE_ITEM_DROP_AMOUNT, UNCOMMON_ITEM_DROP_AMOUNT } from '../types/stats';
import getItemGradeColor from './GetItemGradeColor';

interface IReturnedPlayerItem {
    item: IPlayerItem;
    quantity: number;
}

export const createPlayerOwnedItem = async (
    player: IPlayer,
    itemId: Realm.BSON.ObjectId,
): Promise<IReturnedPlayerItem | undefined> => {
    const client = getMongoClient();
    let quantity: number = 1;

    if (!client) {
        console.error("No client found");
        return;
    }

    const playerItems = client.db("bots_rpg").collection<IPlayerItem>("playerItems");

    try {
        const itemAlreadyOwned = await playerItems.findOne({ baseItemId: itemId, ownerId: player._id });
        const baseItem = await GetBaseItem(itemId);

        // Here we handle logic for the quantity of items dropped for
        // different rarities. For example, rare items should not drop the same amount
        // as uncommon, even though they are harder to get.
        //
        if (baseItem?.grade === 'common') {
            quantity = Math.floor(Math.random() * COMMON_ITEM_DROP_AMOUNT) + 1;;
        } else if (baseItem?.grade === 'uncommon') {
            quantity = Math.floor(Math.random() * UNCOMMON_ITEM_DROP_AMOUNT) + 1;;
        } else if (baseItem?.grade === 'rare') {
            quantity = Math.floor(Math.random() * RARE_ITEM_DROP_AMOUNT) + 1;;
        } else if (baseItem?.grade === 'epic') {
            quantity = EPIC_ITEM_DROP_AMOUNT;
        } else {
            quantity = 1;
        }

        const displayToast = async () => {
            toast.success(`+ ${quantity} ${baseItem?.name}`, {
                style: {
                    borderRadius: 0,
                    background: 'black',
                    color: getItemGradeColor(baseItem?.grade ?? "common"),
                },
            });
        };

        // if player already owns the item, update it.
        //
        if (itemAlreadyOwned) {
            await modifyOwnedItem(itemAlreadyOwned._id, quantity);
            await displayToast();
            return { item: itemAlreadyOwned, quantity: quantity ?? 1 };
        } else {
            // Create a new unique item in the database if he doesn't own it
            //
            const newItem: IPlayerItem = {
                _id: new Realm.BSON.ObjectId(),
                baseItemId: itemId,
                ownerId: player._id,
                quantity: quantity ?? 1,
            };
            await playerItems.insertOne(newItem);
            await displayToast();
            return { item: newItem, quantity: quantity ?? 1 };
        }
    } catch (err: any) {
        console.error(`Failed to create or modify item ${itemId}:`, err);
        throw new Error(`Failed to create or modify item: ${err.message}`);
    }
}
