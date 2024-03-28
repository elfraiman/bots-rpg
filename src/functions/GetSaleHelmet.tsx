import * as Realm from 'realm-web';
import { IHelmet, IPlayer } from "../types/types";


const app = Realm.App.getApp('application-0-vgvqx');


export const getSaleHelmet = async (helmet: IHelmet, player: IPlayer, updatePlayerData: any): Promise<boolean | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const helmetsCollection = mongodb.db("bots_rpg").collection<IHelmet>("helmets");

    try {
        if (helmet !== undefined && player) {
            await helmetsCollection.deleteOne({ _id: helmet._id });

            updatePlayerData({
                ...player,
                gold: player.gold + (helmet.cost / 2),
                inventory: {
                    ...player.inventory,
                    helmets: player.inventory.helmets.filter((i: IHelmet) => i._id !== helmet._id)
                }
            })

            return true;
        } else {
            console.error("Cant delete helmet");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to create helmet:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}