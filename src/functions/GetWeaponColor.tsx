import { IWeapon } from "../types/types"







const getWeaponColor = (weaponGrade: string) => {

    switch (weaponGrade) {
        case 'common':
            return '#FFFFFF';
        case 'uncommon':
            return '#1EFF0C';
        case 'rare':
            return '#0070FF';
        case 'epic':
            return '#A335EE';
        case 'Legendary':
            return '#FF8000';
    }

}

export default getWeaponColor;