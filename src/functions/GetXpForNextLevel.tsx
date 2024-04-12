


interface ICalculateXpForNextLevelProps {
    level: number;
    baseXp?: number;
    n?: number;
    difficultyFactor?: number;
}




const GetXpForNextLevel = ({ level, baseXp = 50, n = 1.5, difficultyFactor = 10 }: ICalculateXpForNextLevelProps) => {
    let xpRequired = (baseXp * Math.pow(level, n)) + (difficultyFactor * level);

    return Math.round(xpRequired);
}


export default GetXpForNextLevel;