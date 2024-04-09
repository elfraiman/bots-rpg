import * as Realm from 'realm-web';
import { IPlayer } from "../types/types";

export type ITravelDestinations = "Earth" | "Xyleria" | "Volcanix" | "Cryothus";

export interface ITravelDestinationsProps {
    destination: Realm.BSON.ObjectId;
    player: IPlayer;
    updatePlayerData: (updates: Partial<IPlayer>) => Promise<void>;
}

const app = Realm.App.getApp('application-0-vgvqx');


export const getTravel = async ({ destination, player, updatePlayerData }: ITravelDestinationsProps): Promise<boolean | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    try {
        if (destination !== undefined && player) {
            updatePlayerData({
                ...player,
                location: destination
            })
            return true;
        } else {
            console.error("Cannot travel to destination");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to travel:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}