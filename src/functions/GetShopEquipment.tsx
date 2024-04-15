import * as Realm from "realm-web";
import { IArmor, IEquipment, IWeapon } from '../types/types'; // Assuming you've renamed the import to avoid naming conflict
import { getMongoClient } from "../mongoClient";


const getShopArmors = async () => {
    const client = getMongoClient();

    if (!client) {
        console.error("No client found");
        return;
    }

    const shopArmorsCollection = client.db("bots_rpg").collection<IEquipment>("armors");

    if (!shopArmorsCollection) {
        console.error("No armors found");
        return;
    }

    try {
        const armorsResult = await shopArmorsCollection.find({ forSell: true }); // Or just use userId if it's a string
        return armorsResult.sort((a, b) => a.cost - b.cost);
    } catch (err) {
        console.error("Failed to fetch shop weapons data:", err);
    }
};



export default getShopArmors;
