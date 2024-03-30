import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidLeave, useIonViewWillEnter } from "@ionic/react";
import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { useRouteMatch } from "react-router";
import Header from "../../components/Header";
import { PlayerContext } from "../../context/PlayerContext";
import { getSingleEnemy } from "../../functions/GetEnemies";
import getGoldReward from "../../functions/GetGoldReward";
import calculateMaxHealth from "../../functions/GetMaxHealth";
import getItemGradeColor from "../../functions/GetWeaponColor";
import getXpReward from "../../functions/GetXpReward";
import { IEnemy, IPlayer } from "../../types/types";
import './BattleTrain.css';
import GetTrashLoot from "../../functions/GetTrashLoot";

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
  enemyName: { fontWeight: 'bold', color: '#ffff00', marginRight: 1 },
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
  const { player, setPlayer, updatePlayerData } = useContext(PlayerContext); // Assuming usePlayerHook returns player with health
  const [enemy, setEnemy] = useState<IEnemy>(); // Initialized to an empty object, populated upon view enter
  const [playerHealth, setPlayerHealth] = useState<number>(0);
  const [enemyHealth, setEnemyHealth] = useState<number>(0);
  const [fightNarrative, setFightNarrative] = useState<ReactElement[]>([]);
  const [battleActive, setBattleActive] = useState<boolean>(false);
  const turnRef = useRef<boolean>(true); // true indicates it's the player's turn, false for the enemy's turn
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const match = useRouteMatch<{ id: string }>();


  const [battleStats, setBattleStats] = useState({
    attempts: 0,
    hits: 0,
    maxHit: 0,
    misses: 0,
    dodges: 0,
    totalDamage: 0,
  });


  // Ref for scrolling
  const narrativeEndRef = useRef(null);


  const getEnemy = async () => {
    const params: any = match.params;
    const monsterId = params.id;

    if (monsterId) {
      const enemyData = await getSingleEnemy({ monsterId: monsterId });

      if (enemyData) {
        const enemyMaxHealth = calculateMaxHealth(enemyData);
        setEnemy(enemyData);
        setEnemyHealth(enemyMaxHealth); // Setting enemy's health based on the loaded enemy data
      }
    }

  }

  useIonViewWillEnter(() => {
    console.log("[Battle]: View will enter")
    getEnemy();
    setFightNarrative([]);

    if (player) {
      const playerMaxHealth = calculateMaxHealth(player);
      setPlayerHealth(playerMaxHealth);
    }

  });

  const returnEnemyShape = (enemy: IEnemy, health: number) => {
    let enemyNameStyled = <span style={style.enemyName}>{enemy.name}</span>;
    const enemyMaxHealth = calculateMaxHealth(enemy);

    if (health > 0.80 * enemyMaxHealth) {
      return <span style={style.goodShape}> {enemyNameStyled}  is in good shape.</span>
    } else if (health > 0.65 * enemyMaxHealth) {
      return <span style={style.reasonableShape}> {enemyNameStyled}  is in reasonable shape.</span>
    } else if (health > 0.40 * enemyMaxHealth) {
      return <span style={style.badShape}> {enemyNameStyled}  is in bad shape.</span>
    } else if (health > 0.20 * enemyMaxHealth) {
      return <span style={style.barelyAlive}> {enemyNameStyled} is barely alive.</span>
    } else if (health > 0.01 * enemyMaxHealth) {
      return <span style={style.barelyAlive}> {enemyNameStyled} is barely hanging on.</span>
    } else {
      return <span style={style.barelyAlive}> {enemyNameStyled} is dead!</span>
    }
  }

  const returnPercentageColor = (health: number) => {
    if (!player) return;
    const playerMaxHealth = calculateMaxHealth(player);
    const percentage = health * playerMaxHealth / 100;
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
    const dexModifier = 0.01; // Incase something affects dex
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
    if (!player || !enemy) return;
    const playerMaxHealth = calculateMaxHealth(player);
    const randomNumber = Math.random();


    if (randomNumber <= hitChance) {
      const damageDealt = Math.floor(Math.random() * (maxDamage - minDamage + 1) + minDamage);
      let newPlayerHealth = playerHealth;
      let newEnemyHealth = enemyHealth;

      if (isPlayerAttack) {
        newEnemyHealth = Math.max(enemyHealth - damageDealt, 0);
        setEnemyHealth(newEnemyHealth);

      } else {
        newPlayerHealth = Math.max(playerHealth - damageDealt, 0);
        setPlayerHealth(newPlayerHealth);
      }


      const hitMessage = (
        <div style={style.fightNarrative}>
          <span style={isPlayerAttack ? style.playerName : style.enemyName}>
            {attacker.name}
          </span> hits
          <span style={!isPlayerAttack ? style.playerName : style.enemyName}> {defender.name}
          </span> with its
          <span style={{ ...style.weaponName, color: getItemGradeColor(player?.equipment?.mainHand?.grade ?? 'common') }}> {attacker.equipment?.mainHand?.name}.
          </span>
          <br />
          <span style={isPlayerAttack ? style.playerDamage : style.enemyDamage}>
            ({damageDealt} damage)
          </span>
          <br />
          <span>
            {isPlayerAttack ? returnEnemyShape(enemy, newEnemyHealth) :
              <span style={style.playerHealth}> damage report: {newPlayerHealth}/{playerMaxHealth}  <span style={returnPercentageColor(playerHealth)}>
                {Math.round((newPlayerHealth / playerMaxHealth) * 100)} % left
              </span>
              </span>
            }
          </span>
        </div>
      );

      setFightNarrative(prevNarrative => [...prevNarrative, hitMessage]);


      if (isPlayerAttack) {

        // Add to log
        setBattleStats(prevStats => ({
          ...prevStats,
          attempts: prevStats.attempts + 1,
          hits: prevStats.hits + 1,
          maxHit: Math.max(prevStats.maxHit, damageDealt),
          totalDamage: prevStats.totalDamage + damageDealt,
        }));
      }

    } else {
      const missMessage = (
        <div style={style.fightNarrative}>
          <span style={isPlayerAttack ? style.playerName : style.enemyName}>{attacker.name} </span>
          <span>missed
            <span style={!isPlayerAttack ? style.playerName : style.enemyName}> {defender.name}
            </span>
          </span>
        </div>
      );
      setFightNarrative(prevNarrative => [...prevNarrative, missMessage]);

      // Add to log
      //
      if (isPlayerAttack) {
        setBattleStats(prevStats => ({
          ...prevStats,
          attempts: prevStats.attempts + 1,
          misses: prevStats.misses + 1,
        }));
      } else {
        // player dodged
        setBattleStats(prevStats => ({
          ...prevStats,
          dodges: prevStats.dodges + 1,
        }));
      }
    }
  };

  const startFight = () => {
    if (enemy && player) {
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

        if (playerHealth <= 0) {
          fightEnd(false, enemy, player);
        } else {
          fightEnd(true, enemy, player);
        }
      }

      // Toggle the turn for the next interval
      turnRef.current = !turnRef.current;
    }
  };

  const fightEnd = async (playerWin: boolean, enemy: IEnemy, player: IPlayer) => {
    console.log('fight end')
    const playerMaxHealth = calculateMaxHealth(player);
    const enemyMaxHealth = calculateMaxHealth(enemy);
    if (playerWin) {
      console.log(enemy, 'enemy');
      try {
        const trashLoot = await GetTrashLoot(enemy.trashLoot[0]);

        console.log('Player Wins!', trashLoot);
      } catch (e) {
        console.error(e);
      }


      const goldReward = getGoldReward({ enemy: enemy, playerLevel: player.level });
      const xpReward = getXpReward({ enemyLevel: enemy.level, enemyType: enemy.type as "standard" | "elite" | "boss", playerLevel: player.level })

      updatePlayerData({ ...player, gold: player.gold += goldReward, experience: player.experience += xpReward })


      // Add average damage and hit rate to the battleStats logging.
      // and set winnerMessage display
      //
      const averageDamage = battleStats.hits > 0 ? Math.round(battleStats.totalDamage / battleStats.hits) : 0;
      const hitRate = battleStats.attempts > 0 ? Math.round((battleStats.hits / battleStats.attempts) * 100) : 0;
      // The battle stats log
      //
      const battleStatsLogMessage = (
        <div>
          <IonGrid>
            <IonRow>
              <IonCol>Attempts</IonCol>
              <IonCol>{battleStats.attempts}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol>Hit Rate</IonCol>
              <IonCol>{hitRate}%</IonCol>
            </IonRow>
            <IonRow>
              <IonCol>Max Hit</IonCol>
              <IonCol>{battleStats.maxHit}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol>Misses</IonCol>
              <IonCol>{battleStats.misses}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol>Dodges</IonCol>
              <IonCol>{battleStats.dodges}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol>Average Damage</IonCol>
              <IonCol>{averageDamage}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol>Total Damage</IonCol>
              <IonCol>{battleStats.totalDamage}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol>Winner</IonCol>
              <IonCol><span style={{ color: playerWin ? style.playerName.color : style.enemyName.color, fontWeight: 'bold' }}>{playerWin ? player.name : enemy.name}</span></IonCol>
            </IonRow>
            <IonRow>
              <IonCol>Gold reward</IonCol>
              <IonCol><span style={{ color: 'gold' }}>{goldReward}</span></IonCol>
            </IonRow>
            <IonRow>
              <IonCol>Gained XP</IonCol>
              <IonCol><span style={{ color: 'aquamarine' }}>{xpReward}</span></IonCol>
            </IonRow>
          </IonGrid>
        </div>
      );

      setFightNarrative(prev => [...prev, battleStatsLogMessage]);

      // reset stats
      //
      setPlayerHealth(playerMaxHealth);
      setEnemyHealth(enemyMaxHealth);
      setBattleStats({
        attempts: 0,
        hits: 0,
        maxHit: 0,
        misses: 0,
        totalDamage: 0,
        dodges: 0,
      });
    }
  }

  // interval effect
  useEffect(() => {
    if (battleActive && player && enemy) {
      intervalIdRef.current = setInterval(alternateAttack, 1000); // Set interval to 1 second
    }

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [battleActive, player, enemy, playerHealth, enemyHealth]);


  // Automatically scroll to the latest narrative entry
  useEffect(() => {
    (narrativeEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' });
  }, [fightNarrative]);

  useIonViewDidLeave(() => {
    if (player && enemy) {
      const playerMaxHealth = calculateMaxHealth(player);
      const enemyMaxHealth = calculateMaxHealth(enemy);
      setPlayerHealth(playerMaxHealth);
      setEnemyHealth(enemyMaxHealth);
    }
  })


  return (
    <IonPage>
      <Header />

      <IonToolbar>
        <IonTitle style={{ textAlign: 'center' }}>
          <span style={style.playerName}>{player?.name}</span> VS <span style={style.enemyName}>{enemy?.name}</span>
        </IonTitle>
      </IonToolbar>

      <IonContent>
        <IonImg src={`/images/enemies/enemy-${enemy?.imgId}.webp`} alt="Enemy" className="room-banner" />

        <div className="ion-padding fight-narrative">
          {fightNarrative.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          {!battleActive ? (<IonButton onClick={startFight} style={{ width: '100%' }}>Fight</IonButton>) : (<></>)}
          {/* Invisible element at the end of your narratives */}

          <div ref={narrativeEndRef} />
        </div>

      </IonContent>
    </IonPage>
  );
};

export default BattleTrain;
