import { useEffect, useState } from 'react';
import * as Realm from "realm-web";
import { IWeapon } from '../types/schemas'; // Assuming you've renamed the import to avoid naming conflict

const app = new Realm.App({ id: 'application-0-vgvqx' });

const useWeaponsHook = () => {
    const [weaponsData, setWeaponsData] = useState<IWeapon[]>([]);

    useEffect(() => {
        const fetchWeapons = async () => {
            // Ensure there's a logged-in user
            if (!app.currentUser) {
                console.error("No current user found");
                return;
            }

            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const weapons = mongodb.db("bots_rpg").collection<IWeapon>("weapons");

            if (!weapons) {
                console.error("No weapons found");
                return;
            }

            try {
                const weaponsResult = await weapons.find({}); // Or just use userId if it's a string
                setWeaponsData(weaponsResult);
            } catch (err) {
                console.error("Failed to weapons data:", err);
            }
        };

        fetchWeapons();
    }, []); // Empty dependency array means this effect runs once on mount

    return weaponsData;
}

export default useWeaponsHook;
