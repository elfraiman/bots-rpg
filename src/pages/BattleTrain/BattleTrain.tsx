import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useRouteMatch } from "react-router";
import { getEnemy } from "../../data/enemies";
import usePlayerHook from "../../hooks/GetPlayerHook";
import { Ienemy, Iplayer } from "../../types/schemas";


interface IFightResult {
  hitChance: number;
  maxDamage: number;
  minDamage: number;
  attacker: Iplayer | Ienemy;
  defender: Iplayer | Ienemy;
  isPlayerAttack: boolean;
}

// Example of an inline style for demonstration
const style = {
  attackerName: { fontWeight: 'bold', color: 'blue' },
  defenderName: { fontWeight: 'bold', color: 'red' },
  weaponName: { fontStyle: 'italic' },
  damage: { fontWeight: 'bold' }
};


const BattleTrain = () => {
  const player: Iplayer = usePlayerHook(); // Assuming usePlayerHook returns player with health
  const [enemy, setEnemy] = useState<Ienemy>(); // Initialized to an empty object, populated upon view enter
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

  const attack = (attacker: Iplayer | Ienemy, defender: Iplayer | Ienemy, isPlayerAttack: boolean) => {
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
        <div>
          <span style={style.attackerName}>{attacker.name}</span> hits
           <span style={style.defenderName}> {defender.name} </span>
           with its <span style={style.weaponName}>{attacker.equipment?.mainHand?.name} </span>.
          <br />
          (<span style={style.damage}>{damageDealt} damage</span>)
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
        <div>
          <span style={style.attackerName}>{attacker.name}</span> misses.
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
        const winnerMessage = playerHealth <= 0 ? `${enemy.name} wins!` : `${player.name} wins!`;
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
      <IonContent className="ion-padding">
        <IonButton onClick={startFight}>Attack</IonButton>
        <div>Player Health: {playerHealth}</div>
        <div>Enemy Health: {enemyHealth}</div>
        {fightNarrative.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default BattleTrain;
