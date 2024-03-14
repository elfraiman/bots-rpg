import { useState, useEffect } from "react";
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import { useRouteMatch } from "react-router";
import { getEnemy } from "../../data/enemies";
import usePlayerHook from "../../hooks/GetPlayerHook";

const BattleTrain = () => {
  const player = usePlayerHook(); // Assuming usePlayerHook returns player with health
  const [enemy, setEnemy] = useState<any>({});
  const [playerHealth, setPlayerHealth] = useState<number>(player?.maxHealth || 100); // Defaulting to 100 if player health is not set
  const [enemyHealth, setEnemyHealth] = useState<number>(0);
  const [fightNarrative, setFightNarrative] = useState<string[]>([]);
  const match = useRouteMatch();

  useIonViewWillEnter(() => {
    const params: any = match.params;
    const enemyData = getEnemy(Number(params.id));
    if (enemyData) {
      setEnemy(enemyData);
      setEnemyHealth(enemyData?.maxHealth); // Setting enemy's health based on the loaded enemy data
    }
    // Reset player health to maxHealth when player or enemy changes
    setPlayerHealth(player?.maxHealth || 100);
    setFightNarrative([]);
  }, [player, enemy]);


  const attack = (attacker: any, defender: any, isPlayer: boolean) => {
    if (!attacker || !defender) {
      setFightNarrative((prev) => [...prev, "Player or enemy is missing."]);
      return;
    }

    const baseHitChance = 0.7;
    const dexDifference = attacker.dex - defender.dex;
    const dexModifier = 0.01;
    const hitChance = baseHitChance + (dexDifference * dexModifier) + 0.05;

    const strModifierForMinDamage = 0.2;
    const baseDamageIncrease = 1; // Adjusted as a skill or buff

    const minDamageBase = attacker.equipment?.mainHand?.minDamage ?? 0;
    const maxDamageBase = attacker.equipment?.mainHand?.maxDamage ?? 0;

    const minDamage = Math.round(minDamageBase + (attacker.str * strModifierForMinDamage) + baseDamageIncrease);
    const maxDamage = Math.round(maxDamageBase + (attacker.str * strModifierForMinDamage) + baseDamageIncrease);

    // Apply the fight results and update the narrative
    applyFightResults({
      hitChance,
      maxDamage,
      minDamage,
      attacker,
      defender,
      isPlayerAttack: isPlayer
    });
  };


  const applyFightResults = ({ hitChance, maxDamage, minDamage, attacker, defender, isPlayerAttack }: any) => {
    const randomNumber = Math.random();

    // Ensure we're appending to the narrative correctly for each event.
    const updateNarrative = (message: string) => {
      setFightNarrative((prevNarrative) => [...prevNarrative, message]);
    };

    if (randomNumber <= hitChance) {
      const damageDealt = Math.floor(Math.random() * (maxDamage - minDamage + 1) + minDamage);
      const hitMessage = `${attacker.name} hits ${defender.name} for ${damageDealt} damage.`;
      updateNarrative(hitMessage);

      if (isPlayerAttack) {
        setEnemyHealth((prevHealth) => {
          const newHealth = Math.max(prevHealth - damageDealt, 0);
          console.log(newHealth, 'newH')
          if (newHealth <= 0) {
            const victoryMessage = `${attacker.name} has won the battle!`;
            updateNarrative(victoryMessage);
            return 0;
          }
          return newHealth;
        });
      } else {
        setPlayerHealth((prevHealth) => {
          const newHealth = Math.max(prevHealth - damageDealt, 0);
          if (newHealth <= 0) {
            const defeatMessage = `${defender.name} has won the battle!`;
            updateNarrative(defeatMessage);
            return 0; 
          }
          return newHealth;
        });
      }
    } else {
      const missMessage = `${attacker.name} misses.`;
      updateNarrative(missMessage);
    }

    // Continue the battle loop if nobody has won yet, with a delay for readability.
      setTimeout(() => {
        if (playerHealth <= 0 || enemyHealth <= 0) {
          // Battle has concluded, no further action needed.
          return;
        }

        console.log(playerHealth, enemyHealth, 'health');
        if (isPlayerAttack) {
          // Enemy's turn to attack
          attack(enemy, { ...player, health: playerHealth }, false);
        } else {
          // Player's turn to attack
          attack({ ...player, health: playerHealth }, enemy, true);
        }
      }, 300); // Adds suspense and allows the user to follow the battle narrative.
  };

  const startFight = () => {
    setFightNarrative([]);
    attack({ ...player, health: playerHealth }, enemy, true); // Player starts the first attack
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Fighting {enemy.name}</IonTitle>
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
