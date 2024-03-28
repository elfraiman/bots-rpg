import * as Realm from 'realm-web';
import { IBoots, IPlayer } from "../types/types";


const app = Realm.App.getApp('application-0-vgvqx');


export const getSaleBoots = async (boots: IBoots, player: IPlayer, updatePlayerData: any): Promise<boolean | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const bootsCollection = mongodb.db("bots_rpg").collection<IBoots>("boots");

    try {
        if (boots !== undefined && player) {
            await bootsCollection.deleteOne({ _id: boots._id });

            updatePlayerData({
                ...player,
                gold: player.gold + (boots.cost / 2),
                inventory: {
                    ...player.inventory,
                    boots: player.inventory.boots.filter((i: IBoots) => i._id !== boots._id)
                }
            })

            return true;
        } else {
            console.error("Cant delete boots");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to create boots:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}