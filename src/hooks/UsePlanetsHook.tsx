import { useEffect, useState } from 'react';
import * as Realm from "realm-web";
import { IPlanet } from '../types/types'; // Assuming you've renamed the import to avoid naming conflict

const app = Realm.App.getApp('application-0-vgvqx');

const usePlanetsHook = () => {
    const [planetsData, setPlanetsData] = useState<IPlanet[]>([]);

    useEffect(() => {
        const fetchPlanets = async () => {
            // Ensure there's a logged-in user
            if (!app.currentUser) {
                console.error("No current user found");
                return;
            }

            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const planets = mongodb.db("bots_rpg").collection<IPlanet>("planets");

            if (!planets) {
                console.error("No weapons found");
                return;
            }

            try {
                const planetsResult = await planets.find({}); // Or just use userId if it's a string
                setPlanetsData(planetsResult);
            } catch (err) {
                console.error("Failed to planets data:", err);
            }
        };

        fetchPlanets();
    }, []); // Empty dependency array means this effect runs once on mount

    return planetsData;
}

export default usePlanetsHook;
