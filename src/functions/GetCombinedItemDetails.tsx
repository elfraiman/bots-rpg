import * as Realm from 'realm-web';
import GetBaseItem from "./GetBaseItem";
import GetPlayerOwnedItem from "./GetPlayerOwnedItem";


//
export const GetCombinedItemDetails = async (itemId: Realm.BSON.ObjectId, ownerId: string) => {
    // Fetch the player-owned item details

    try {
        const playerOwnedItemDetails = await GetPlayerOwnedItem(itemId, ownerId);

        if (!playerOwnedItemDetails) return;

        // Assuming `fetchPlayerOwnedItemDetails` returns an object that includes a `baseItemId`
        const baseItemId = playerOwnedItemDetails?.baseItemId;

        // Fetch the base item details using the baseItemId
        const baseItemDetails = await GetBaseItem(baseItemId);
        if (!baseItemDetails) return;

        // Combine the details (simple example, adjust according to your data structure)
        const combinedDetails = {
            ...baseItemDetails,
            ...playerOwnedItemDetails,
        };

        return combinedDetails;

    } catch (e) {
        throw (e);
    }

};
