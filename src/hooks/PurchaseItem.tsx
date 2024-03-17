import * as Realm from 'realm-web';
import { IPlayer, IWeapon } from "../types/schemas";

interface IPurchaseItemProps {
  item: IWeapon;
  player: IPlayer;
}

const app = Realm.App.getApp('application-0-vgvqx'); // replace this with your App ID

// Adjusted UsePurchaseItem function to correctly handle asynchronous operations
const UsePurchaseItem = async ({ item, player }: IPurchaseItemProps): Promise<IPlayer | null> => {
  // Check for a logged-in user and valid player object upfront
  if (!app.currentUser || !player) {
    console.log(app.currentUser, player);
    console.error("No current user found or player object is invalid");
    return null;
  }

  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const players = mongodb.db("bots_rpg").collection("players");

  try {
    // Perform the update operation
    await players.updateOne(
      { _id: player._id },
      { $set: { 'equipment.mainHand': item, 'gold': player.gold - item.cost } }
    );

    // Fetch and return the updated player data
    const updatedPlayerDocument = await players.findOne({ _id: player._id });
    if (updatedPlayerDocument) {
      // Assuming the findOne method returns a document that matches the IPlayer interface
      return updatedPlayerDocument as IPlayer;
    } else {
      console.error("Failed to fetch updated player data");
      return null;
    }
  } catch (err) {
    console.error("Failed to update player data:", err);
    return null;
  }
}

export default UsePurchaseItem;
