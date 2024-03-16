import { useEffect, useState } from 'react';
import * as Realm from "realm-web";
import { IPlayer } from '../types/schemas'; // Assuming you've renamed the import to avoid naming conflict

const app = new Realm.App({ id: 'application-0-vgvqx' });

const usePlayerHook = () => {
    const [playerData, setPlayerData] = useState<IPlayer | null>(null);
    
   
    useEffect(() => {

        const fetchPlayer = async () => {
            if (playerData) {
                return playerData;
            }
        
            // Ensure there's a logged-in user
            if (!app.currentUser) {
                console.error("No current user found");
                return;
            }

            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const players = mongodb.db("bots_rpg").collection<IPlayer>("players");
            const userId = app.currentUser.id;

            if (!userId) {
                console.error("No user id found");
                return;
            }

            try {
                const playerResult = await players.findOne({ _id: userId }); // Or just use userId if it's a string
                setPlayerData(playerResult);
            } catch (err) {
                console.error("Failed to fetch player data:", err);
            }


        };

        fetchPlayer();
    }, []); // Empty dependency array means this effect runs once on mount

    return playerData;
}

export default usePlayerHook;
