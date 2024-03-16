import { IonButton, IonContent, IonHeader, IonImg, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useRouteMatch } from "react-router";
import { getEnemy } from "../../data/enemies";
import usePlayerHook from "../../hooks/UsePlayerHook";
import { IEnemy, IPlayer } from "../../types/schemas";
import './BattleTrain.css';

interface IFightResult {
  hitChance: number;
  maxDamage: number;
  minDamage: number;
  attacker: IPlayer | IEnemy;
  defender: IPlayer | IEnemy;
  isPlayerAttack: boolean;
}

// Example of an inline style for demonstration
const style = {
  fightNarrative: { color: '#99cc00', marginBottom: 16 },
  playerName: { fontWeight: 'bold', color: '#00e1ff', marginRight: 1 },
  defenderName: { fontWeight: 'bold', color: '#ffff00', marginRight: 1 },
  weaponName: { fontStyle: 'italic' },
  playerDamage: { color: 'white' },
  enemyDamage: { fontWeight: 100, color: 'grey' },
  miss: { color: 'red' },
  goodShape: { color: '#33ff00' },
  reasonableShape: { color: '#99cc00' },
  notGoodShape: { color: '#bbaa00' },
  badShape: { color: '#ee6600' },
  barelyAlive: { color: '#ff0000' },
  dead: { color: '#ff0000' },
  playerHealth: { color: 'black', backgroundColor: '#4c4c4c' }
};


const BattleTrain = () => {
  const player: IPlayer = usePlayerHook(); // Assuming usePlayerHook returns player with health
  const [enemy, setEnemy] = useState<IEnemy>(); // Initialized to an empty object, populated upon view enter
  const [playerHealth, setPlayerHealth] = useState<number>(player?.maxHealth || 100);
  const [enemyHealth, setEnemyHealth] = useState<number>(0);
  const [fightNarrative, setFightNarrative] = useState<ReactElement[]>([]);
  const [battleActive, setBattleActive] = useState<boolean>(false);
  const turnRef = useRef<boolean>(true); // true indicates it's the player's turn, false for the enemy's turn
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const match = useRouteMatch<{ id: string }>();

  useIonViewWillEnter(() => {
    console.log("[TRAINING_BATTLE]: View will enter")
    const params: any = match.params;
    const enemyData = getEnemy(Number(params.id));

    if (enemyData) {
      setEnemy(enemyData);
      setEnemyHealth(enemyData?.maxHealth); // Setting enemy's health based on the loaded enemy data
    }

    // Reset player health to maxHealth when player or enemy changes
    setPlayerHealth(player?.maxHealth || 100);
    setFightNarrative([]);
  });

  const returnEnemyShape = (enemy: IEnemy) => {
    const health = enemyHealth;
    let enemyNameStyled = <span style={style.defenderName}>{enemy.name}</span>;

    if (health > 0.80 * enemy.maxHealth) {
      return <span style={style.goodShape}> {enemyNameStyled}  is in good shape.</span>
    } else if (health > 0.65 * enemy.maxHealth) {
      return <span style={style.reasonableShape}> {enemyNameStyled}  is in reasonable shape.</span>
    } else if (health > 0.40 * enemy.maxHealth) {
      return <span style={style.badShape}> {enemyNameStyled}  is in bad shape.</span>
    } else if (health > 0.20 * enemy.maxHealth) {
      return <span style={style.barelyAlive}> {enemyNameStyled} is barely alive.</span>
    }
    else {
      console.log("Health is below 15%");
    }

  }

  const returnPercentageColor = (health: number) => {
    const percentage = health * player.maxHealth / 100;
    if (percentage > 80) {
      return style.goodShape;
    } else if (percentage > 65) {
      return style.reasonableShape;
    } else if (percentage > 40) {
      return style.notGoodShape;
    } else if (percentage > 20) {
      return style.badShape;
    } else {
      return style.barelyAlive;
    }

  }

  const attack = (attacker: IPlayer | IEnemy, defender: IPlayer | IEnemy, isPlayerAttack: boolean) => {
    if (!attacker || !defender) {
      setFightNarrative(prev => [...prev, <div>Player or enemy is missing.</div>]);
      return;
    }

    const baseHitChance = 0.7;
    const dexDifference = attacker.dex - defender.dex;
    const dexModifier = 0.01;
    const hitChance = baseHitChance + (dexDifference * dexModifier) + 0.05;
    const strModifierForMinDamage = 0.2;
    const baseDamageIncrease = 1;

    const minDamageBase = attacker.equipment?.mainHand?.minDamage ?? 0;
    const maxDamageBase = attacker.equipment?.mainHand?.maxDamage ?? 0;

    const minDamage = Math.round(minDamageBase + (attacker.str * strModifierForMinDamage) + baseDamageIncrease);
    const maxDamage = Math.round(maxDamageBase + (attacker.str * strModifierForMinDamage) + baseDamageIncrease);

    applyFightResults({
      hitChance,
      maxDamage,
      minDamage,
      attacker,
      defender,
      isPlayerAttack: isPlayerAttack
    });
  };

  const applyFightResults = ({ hitChance, maxDamage, minDamage, attacker, defender, isPlayerAttack }: IFightResult) => {
    const randomNumber = Math.random();

    if (randomNumber <= hitChance) {
      const damageDealt = Math.floor(Math.random() * (maxDamage - minDamage + 1) + minDamage);

      const hitMessage = (
        <div style={style.fightNarrative}>
          <span style={isPlayerAttack ? style.playerName : style.defenderName}>
            {attacker.name}
          </span> hits
          <span style={!isPlayerAttack ? style.playerName : style.defenderName}> {defender.name}
          </span> with its
          <span style={style.weaponName}> {attacker.equipment?.mainHand?.name}.
          </span>
          <br />
          <span style={isPlayerAttack ? style.playerDamage : style.enemyDamage}>
            ({damageDealt} damage)
          </span>
          <br />
          <span>
            {isPlayerAttack ? returnEnemyShape(enemy) :
              <span style={style.playerHealth}>damage report: {playerHealth}/{player?.maxHealth}  <span style={returnPercentageColor(playerHealth)}>
                {playerHealth * player.maxHealth / 100} % left
              </span>
              </span>
            }
          </span>
        </div>
      );

      setFightNarrative(prevNarrative => [...prevNarrative, hitMessage]);

      if (isPlayerAttack) {
        setEnemyHealth((prevHealth: number) => Math.max(prevHealth - damageDealt, 0));
      } else {
        setPlayerHealth((prevHealth: number) => Math.max(prevHealth - damageDealt, 0));
      }
    } else {
      const missMessage = (
        <div style={style.fightNarrative}>
          <span style={isPlayerAttack ? style.playerName : style.defenderName}>{attacker.name} </span>
          <span>missed
            <span style={!isPlayerAttack ? style.playerName : style.defenderName}> {defender.name}
            </span>
          </span>
        </div>
      );
      setFightNarrative(prevNarrative => [...prevNarrative, missMessage]);
    }
  };

  const startFight = () => {
    if (enemy) {
      setFightNarrative([]);
      setBattleActive(true);
      attack(player, enemy, true);
    }
  };

  const alternateAttack = () => {
    if (battleActive && player && enemy) {
      if (turnRef.current) {
        if (playerHealth > 0 && enemyHealth > 0) {
          attack(player, enemy, true);
        }
      } else {
        if (playerHealth > 0 && enemyHealth > 0) {
          attack(enemy, player, false);
        }
      }

      if (playerHealth <= 0 || enemyHealth <= 0) {
        clearInterval(intervalIdRef.current as NodeJS.Timeout);
        setBattleActive(false);
        const winnerMessage = playerHealth <= 0 ?
          <span>{enemy.name} wins!</span>
          :
          <span>{player.name} wins!</span>;
        setFightNarrative(prev => [...prev, winnerMessage]);
      }

      // Toggle the turn for the next interval
      turnRef.current = !turnRef.current;
    }
  };

  // interval effect
  useEffect(() => {
    if (battleActive && player && enemy) {
      intervalIdRef.current = setInterval(alternateAttack, 1000); // Set interval to 1 second
    }

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    };
  }, [battleActive, player, enemy, playerHealth, enemyHealth]);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Fighting {enemy?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonImg src={`resources/images/EnemyId-${enemy?._id}.webp`} alt="Enemy" className="room-banner" />
        <IonButton onClick={startFight} style={{ width: '100%' }}>Attack</IonButton>
        <div className="ion-padding fight-narrative">
          {fightNarrative.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BattleTrain;
