


interface ICalculateXpForNextLevelProps {
    level: number;
    baseXp?: number;
    n?: number;
    difficultyFactor?: number;
}




const GetXpForNextLevel = ({ level, baseXp = 100, n = 1.5, difficultyFactor = 20 }: ICalculateXpForNextLevelProps) => {
    let xpRequired = (baseXp * Math.pow(level, n)) + (difficultyFactor * level);


    return Math.round(xpRequired);
}


export default GetXpForNextLevel;