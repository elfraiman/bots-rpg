import * as Realm from 'realm-web';
import { IItem, IPlayer, IPlayerItem } from "../types/types";

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
        // If a baseItem of the same Id is already owned, return that one.
        //
        const itemAlreadyOwned = await playerItems.findOne({ baseItemId: itemId });

        if (itemAlreadyOwned) {
            return itemAlreadyOwned;
        }

        // Create a new unique item in the database
        const newItem: IPlayerItem = {
            _id: new Realm.BSON.ObjectId(),
            baseItemId: itemId,
            ownerId: player._id,
            quantity: quantity ?? 1,
        };

        await playerItems.insertOne(newItem);
        // Return the new item including its generated _id
        return newItem;

    } catch (err) {
        console.error(`Failed to create ${itemId}:`, err);
        throw err;
    }
}
