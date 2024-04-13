import { IonButton, IonCardSubtitle, IonCol, IonContent, IonGrid, IonImg, IonPage, IonRow, IonSpinner, useIonViewWillLeave } from "@ionic/react";
import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useHistory, useRouteMatch } from "react-router";
import * as Realm from 'realm-web';
import Header from "../../components/Header";
import { useNavigationDisable } from "../../context/DisableNavigationContext";
import { PlayerContext } from "../../context/PlayerContext";
import GetBaseItem from "../../functions/GetBaseItem";
import { GetCombinedEquipmentStatsDetails } from "../../functions/GetCombinedEquipmentStatsDetails";
import { GetCreatePlayerOwnedItem } from "../../functions/GetCreatePlayerOwnedItem";
import { getSingleEnemy } from "../../functions/GetEnemies";
import getGoldReward from "../../functions/GetGoldReward";
import getItemGradeColor from "../../functions/GetItemGradeColor";
import GetModifyOwnedItem from "../../functions/GetModifyBaseItem";
import { GetSpawnHiddenEnemies } from "../../functions/GetSpawnHiddenEnemies";
import getXpReward from "../../functions/GetXpReward";
import { BASE_ATTACK_SPEED, calculateAttackSpeed, calculateDamage, calculateHitChance, calculateMaxHealth } from "../../types/stats";
import { IEnemy, IEnemy_equipment_weapon, IEquipment, IItem, IPlayer, IPlayerOwnedArmor, IPlayerOwnedWeapon } from "../../types/types";
import './BattleTrain.css';
import BattleInfoHeader from "../../components/BattleInfoHeader";

interface IFightResult {
  hitChance: number;
  maxAttack: number;
  minAttack: number;
  attacker: IPlayer | IEnemy;
  defender: IPlayer | IEnemy;
  isPlayerAttack: boolean;
}

interface ILootDrop {
  item: IItem | IEquipment;
  quantity: number;
}

interface IPlayerDefensiveStats {
  evasion: number;
  defense: number;
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
  const { setIsNavigationDisabled } = useNavigationDisable(); // Use the custom hook
  const { player, updatePlayerData } = useContext(PlayerContext); // Assuming usePlayerHook returns player with health
  const [playerWeapon, setPlayerWeapon] = useState<IPlayerOwnedWeapon | any>();
  const [playerDefensiveStats, setPlayerDefensiveStats] = useState<IPlayerDefensiveStats>({ evasion: 0, defense: 0 });
  const [currentEnemy, setCurrentEnemy] = useState<IEnemy>();
  const [playerMaxHealth, setPlayerMaxHealth] = useState<number>(0);
  const [enemyMaxHealth, setEnemyMaxHealth] = useState<number>(0);
  const [playerHealth, setPlayerHealth] = useState<number>(0);
  const [enemyHealth, setEnemyHealth] = useState<number>(0);
  const [enemyIntimidation, setEnemyIntimidation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fightNarrative, setFightNarrative] = useState<ReactElement[]>([]);
  const [hiddenEnemyConcluded, setHiddenEnemyConcluded] = useState<boolean>(true);
  const [battleActive, setBattleActive] = useState<boolean>(false);
  const match = useRouteMatch<{ id: string }>();
  const [playerHitInfo, setPlayerHitInfo] = useState({ damage: null, key: 0 });
  const [enemyHitInfo, setEnemyHitInfo] = useState({ damage: null, key: 0 });

  const [playerNextAttack, setPlayerNextAttack] = useState(BASE_ATTACK_SPEED);
  const [enemyNextAttack, setEnemyNextAttack] = useState(BASE_ATTACK_SPEED);
  const history = useHistory();

  const playerTimerRef = useRef<any>();
  const enemyTimerRef = useRef<any>();

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

  const setEnemyInState = (enemy: IEnemy) => {
    const enemyHealth = calculateMaxHealth(enemy);
    setCurrentEnemy(enemy);
    setEnemyHealth(enemyHealth);
    setEnemyMaxHealth(enemyHealth);

    if (enemy.hidden) {
      setEnemyIntimidation(enemy.description ?? '');
      setHiddenEnemyConcluded(false);
    }
  }

  const getEnemy = async () => {
    const params: any = match.params;
    const monsterId = params.id;

    if (monsterId) {
      setLoading(true);
      const enemyData = await getSingleEnemy({ monsterId: monsterId });

      if (enemyData) {
        setEnemyInState(enemyData);
      }
      setLoading(false);
    }
  }

  const resetStats = () => {
    if (!player || !currentEnemy) return;
    const playerHealth = calculateMaxHealth(player);
    const enemyHealth = calculateMaxHealth(currentEnemy);

    // reset stats
    //
    setPlayerHealth(playerHealth);
    setPlayerMaxHealth(playerHealth);
    setEnemyMaxHealth(enemyHealth);
    setEnemyHealth(enemyHealth);
    setBattleStats({
      attempts: 0,
      hits: 0,
      maxHit: 0,
      misses: 0,
      totalDamage: 0,
      dodges: 0,
    });

    setEnemyIntimidation('');
  }

  const getPlayerEquipment = async () => {
    if (!player) return;
    let totalDefense = 0;
    let totalEvasion = 0;

    if (player.equipment && player.equipment.weapon) {
      if (player.equipment) {
        setLoading(true);
        type EquipmentType = 'armor' | 'helmet' | 'boots';
        const equipmentTypes: EquipmentType[] = ['armor', 'helmet', 'boots'];
        for (const type of equipmentTypes) {
          if (player.equipment[type]) {
            const details = await GetCombinedEquipmentStatsDetails(player._id, player.equipment[type] as any) as IPlayerOwnedArmor;
            if (details && details.stats) {
              totalDefense += details.stats.defense || 0;
              totalEvasion += details.stats.evasion || 0;
            }
          }
        }
      }

      const weaponDetails = player.equipment.weapon ? await GetCombinedEquipmentStatsDetails(player._id, player.equipment.weapon) : null;

      if (weaponDetails) {
        setPlayerWeapon(weaponDetails);
      }

      setPlayerDefensiveStats({ evasion: totalEvasion, defense: totalDefense });
    };


    setLoading(false);
  }

  // Initial get enemy
  //
  useEffect(() => {
    getEnemy();
    setFightNarrative([]);
  }, []);


  useEffect(() => {
    if (player) {
      getPlayerEquipment();
      const playerHealth = calculateMaxHealth(player);
      setPlayerHealth(playerHealth);
    }
  }, [player?.attributePoints, player?.equipment]);


  // Returns some text to describe the enemy's health status
  //
  const returnEnemyShape = (enemy: IEnemy, health: number) => {
    let enemyNameStyled = <span style={style.enemyName}>{enemy.name}</span>;
    const enemyHealth = calculateMaxHealth(enemy);

    if (health > 0.80 * enemyHealth) {
      return <span style={style.goodShape}> {enemyNameStyled}  is in good shape.</span>
    } else if (health > 0.65 * enemyHealth) {
      return <span style={style.reasonableShape}> {enemyNameStyled}  is in reasonable shape.</span>
    } else if (health > 0.40 * enemyHealth) {
      return <span style={style.badShape}> {enemyNameStyled}  is in bad shape.</span>
    } else if (health > 0.20 * enemyHealth) {
      return <span style={style.barelyAlive}> {enemyNameStyled} is barely alive.</span>
    } else if (health > 0.01 * enemyHealth) {
      return <span style={style.barelyAlive}> {enemyNameStyled} is barely hanging on.</span>
    } else {
      return <span style={style.barelyAlive}> {enemyNameStyled} is dead!</span>
    }
  }

  // This returns the color of the health left
  //
  const returnPercentageColor = (health: number) => {
    if (!player) return;
    const playerHealth = calculateMaxHealth(player);
    const percentage = (health / playerHealth) * 100;
    if (percentage > 75) {
      return style.goodShape;
    } else if (percentage > 55) {
      return style.reasonableShape;
    } else if (percentage > 35) {
      return style.notGoodShape;
    } else if (percentage > 15) {
      return style.badShape;
    } else {
      return style.barelyAlive;
    }
  }

  const handleHit = (damage: any, isPlayer: boolean) => {
    const hitInfo = { damage, key: Date.now() };
    if (isPlayer) {
      setPlayerHitInfo(hitInfo);
    } else {
      setEnemyHitInfo(hitInfo);
    }
    setTimeout(() => {
      if (isPlayer) {
        setPlayerHitInfo({ damage: null, key: 0 });
      } else {
        setEnemyHitInfo({ damage: null, key: 0 });
      }
    }, 1000); // reset after 1 second to allow for animation completion
  };

  const attack = (isPlayerAttack: boolean) => {
    if (!player || !currentEnemy) {
      setFightNarrative(prev => [...prev, <div>Player or enemy is missing.</div>]);
      return;
    }
    const enemyWeapon = currentEnemy?.equipment?.weapon.stats ?? { minAttack: 0, maxAttack: 0, str: 0 };

    const hitChance = isPlayerAttack ? calculateHitChance(player.dex, currentEnemy.dex) : calculateHitChance(currentEnemy.dex, player.dex, playerDefensiveStats.evasion);
    const damageNumbers = isPlayerAttack ? calculateDamage(playerWeapon.stats.minAttack, playerWeapon.stats.maxAttack, player.str, 0) : calculateDamage(enemyWeapon?.minAttack, enemyWeapon?.maxAttack, currentEnemy.str, playerDefensiveStats.defense);

    applyFightResults({
      hitChance,
      minAttack: damageNumbers.minAttack,
      maxAttack: damageNumbers.maxAttack,
      attacker: isPlayerAttack ? player : currentEnemy,
      defender: isPlayerAttack ? currentEnemy : player,
      isPlayerAttack: isPlayerAttack
    });
  };

  const applyFightResults = ({ hitChance, minAttack, maxAttack, attacker, defender, isPlayerAttack }: IFightResult) => {
    if (!player || !currentEnemy) return;
    const randomNumber = Math.random();

    if (randomNumber <= hitChance) {
      const damageDealt = Math.floor(Math.random() * (maxAttack - minAttack + 1) + minAttack);
      let newPlayerHealth = playerMaxHealth;
      let newEnemyHealth = enemyHealth;

      if (isPlayerAttack) {
        newEnemyHealth = Math.max(enemyHealth - damageDealt, 0);
        setEnemyHealth(newEnemyHealth);
        handleHit(damageDealt, true)
      } else {
        newPlayerHealth = Math.max(playerHealth - damageDealt, 0);
        handleHit(damageDealt, false)
        setPlayerHealth(newPlayerHealth);
        handleHit(damageDealt, false)
      }

      const hitMessage = (
        <div style={style.fightNarrative}>
          <span style={isPlayerAttack ? style.playerName : style.enemyName}>
            {attacker.name}
          </span> hits
          <span style={!isPlayerAttack ? style.playerName : style.enemyName}> {defender.name}
          </span> with its <span style={{ ...style.weaponName, color: getItemGradeColor(isPlayerAttack ? playerWeapon?.grade : 'common' ?? 'common') }}>
            {isPlayerAttack ? playerWeapon?.name : (attacker?.equipment?.weapon as IEnemy_equipment_weapon)?.name}.
          </span>
          <br />
          <span style={isPlayerAttack ? style.playerDamage : style.enemyDamage}>
            ({damageDealt} damage)
          </span>
          <br />
          <span>
            {isPlayerAttack ? returnEnemyShape(currentEnemy, newEnemyHealth) :
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
        // Add to log if hit
        setBattleStats(prevStats => ({
          ...prevStats,
          attempts: prevStats.attempts + 1,
          hits: prevStats.hits + 1,
          maxHit: Math.max(prevStats.maxHit, damageDealt),
          totalDamage: prevStats.totalDamage + damageDealt,
        }));
      }

    } else {
      // If miss
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

  const startFight = async () => {
    if (!currentEnemy || !player) return;
    setLoading(true);
    setIsNavigationDisabled(true);

    // Try to spawn hidden enemies (Elites, Bosses) based on their spawn chance
    // and the players planet location
    //
    const spawnHiddenEnemies = await GetSpawnHiddenEnemies(player);

    if (spawnHiddenEnemies.length > 0 && !currentEnemy.hidden) {

      // Find the enemy with the lowest chanceToEncounter, treating undefined as 1 (or another high value indicating very common)
      const chooseRarestEnemy = spawnHiddenEnemies.reduce((rarest, current) => {
        const rarestChance = rarest.chanceToEncounter !== undefined ? rarest.chanceToEncounter : 1;
        const currentChance = current.chanceToEncounter !== undefined ? current.chanceToEncounter : 1;
        return currentChance < rarestChance ? current : rarest;
      }, spawnHiddenEnemies[0]);

      setFightNarrative([]);
      setEnemyInState(chooseRarestEnemy)
      // if we manage to actually spawn a hidden enemy
      // we want to return here so the player can make a decision to fight or not
      //
      setLoading(false);
      return;
    }


    resetStats();
    setFightNarrative([]);
    setBattleActive(true);
    setLoading(false);
  };

  const fightEnd = async (playerWin: boolean, enemy: IEnemy, player: IPlayer) => {
    setLoading(true);
    let loot: ILootDrop[] = [];
    let goldReward = 0;
    let xpReward = 0;
    let updatedInventory: Realm.BSON.ObjectId[] = [...player.inventory];

    if (playerWin) {
      // Create loot chance logic here
      if (enemy.trashLoot) {
        // This is the logic to create "basic item" loot from the fight
        //
        try {
          // Step 1: Create or get the already owned item from the player owned items.
          // reference the trash loot from the monster
          //
          const playerOwnedItem = await GetCreatePlayerOwnedItem(player, enemy.trashLoot);
          const baseItem = await GetBaseItem(enemy.trashLoot);

          // Check if the player's inventory already includes this playerOwnedItem.
          //
          const itemInInventoryIndex = player.inventory.findIndex(i => i.toString() === playerOwnedItem?._id.toString());
          let amountToDrop = Math.floor(Math.random() * 5) + 1;


          if (itemInInventoryIndex >= 0 && playerOwnedItem) {
            // The player already owns this item, so increase its quantity.
            await GetModifyOwnedItem(playerOwnedItem?._id, amountToDrop);
          } else {
            // The player does not own this item, so add it to the inventory.
            // that will be pushed to the updatePlayerData
            //
            if (playerOwnedItem) {
              updatedInventory.push(playerOwnedItem._id);
              amountToDrop = 1;
            }
          }

          if (baseItem) {
            loot.push({ item: baseItem, quantity: amountToDrop })
            toast(`+ ${amountToDrop} ${baseItem.name}  `,
              {
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
              }
            );
          }

        } catch (e) {
          console.error(e);
        };
      }

      goldReward = getGoldReward({ enemy: enemy, playerLevel: player.level });
      xpReward = getXpReward({ enemyLevel: enemy.level, enemyType: enemy.type as "standard" | "elite" | "boss", playerLevel: player.level })

      // if we were fighting a hidden enemy
      // we mark him as dead so that value can be used to spawn the original enemy
      //
      if (enemy.hidden) {
        setHiddenEnemyConcluded(true);
      }
    } else {
      goldReward = Math.floor(getGoldReward({ enemy: enemy, playerLevel: player.level }) / 10);
      xpReward = Math.floor(getXpReward({ enemyLevel: enemy.level, enemyType: enemy.type as "standard" | "elite" | "boss", playerLevel: player.level }) / 10);

    }

    // Update the player with all the new data
    // this will update in context & back-end
    //
    await updatePlayerData({ ...player, gold: player.gold += goldReward, experience: player.experience += xpReward, inventory: updatedInventory })

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
            <IonCol><span style={{ color: 'gold' }}>{goldReward} 🪙</span></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Gained XP</IonCol>
            <IonCol><span style={{ color: 'aquamarine' }}>{xpReward}</span></IonCol>
          </IonRow>
          {loot.length > 0 ? (
            <IonRow>
              <IonCol>
                Loot:
                {loot.map((i, index) => {
                  return (
                    <p key={index}>{i.quantity}x <span style={{ color: getItemGradeColor(i?.item?.grade ?? 'common') }}> {i?.item?.name}</span></p>
                  );
                })}
              </IonCol>
            </IonRow>
          ) : <></>}
        </IonGrid>
      </div>
    );

    toast(`+ ${goldReward} 🪙`,
      {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );

    setFightNarrative(prev => [...prev, battleStatsLogMessage]);
    setLoading(false);
    setIsNavigationDisabled(false);
  }
  // Attacking logic
  // We use dex to determine who attacks at what speed
  //
  useEffect(() => {
    if (!player || !currentEnemy || !battleActive || !playerWeapon) return;
    const playerAttackSpeed = calculateAttackSpeed(playerWeapon.stats.attackSpeed, player.dex);
    const enemyAttackSpeed = calculateAttackSpeed(currentEnemy.equipment?.weapon.stats.attackSpeed ?? BASE_ATTACK_SPEED, currentEnemy.dex);

    // Schedule the next player attack
    const schedulePlayerAttack = () => {
      const delay = playerNextAttack - Date.now();
      return setTimeout(() => {
        attack(true);
        setPlayerNextAttack(Date.now() + playerAttackSpeed);
      }, delay > 0 ? delay : 0); // Ensure delay is not negative
    };

    // Schedule the next enemy attack
    const scheduleEnemyAttack = () => {
      const delay = enemyNextAttack - Date.now();
      return setTimeout(() => {
        attack(false);
        setEnemyNextAttack(Date.now() + enemyAttackSpeed);
      }, delay > 0 ? delay : 0); // Ensure delay is not negative
    };

    const playerTimer = schedulePlayerAttack();
    const enemyTimer = scheduleEnemyAttack();
    // Assign timers to refs for later cleanup
    playerTimerRef.current = playerTimer;
    enemyTimerRef.current = enemyTimer;

    if (playerHealth <= 0 || enemyHealth <= 0) {
      setBattleActive(false);
      clearTimeout(playerTimer);
      clearTimeout(enemyTimer);
      if (playerHealth <= 0) {
        fightEnd(false, currentEnemy, player);
      } else {
        fightEnd(true, currentEnemy, player);
      }
    }

    return () => {
      if (playerTimerRef.current) clearTimeout(playerTimerRef.current);
      if (enemyTimerRef.current) clearTimeout(enemyTimerRef.current);
    };
  }, [playerNextAttack, enemyNextAttack, player, currentEnemy, battleActive]);

  // Automatically scroll to the latest narrative entry
  useEffect(() => {
    (narrativeEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' });
  }, [fightNarrative]);


  // Ionic lifecycle event for component will leave
  useIonViewWillLeave(() => {
    if (player && currentEnemy) {
      resetStats();
      setFightNarrative([]);
    }

    // Clear timeouts when leaving the view
    if (playerTimerRef.current) clearTimeout(playerTimerRef.current);
    if (enemyTimerRef.current) clearTimeout(enemyTimerRef.current);
    setIsNavigationDisabled(false);
  });

  // Calculate health percentage
  const playerHealthPercent = (playerHealth / playerMaxHealth) * 100;
  const enemyHealthPercent = (enemyHealth / enemyMaxHealth) * 100;

  return (
    <IonPage >
      <Header />
      {
        //* Battle header enemy vs player *//
      }
      <BattleInfoHeader
        enemyHealthPercent={enemyHealthPercent}
        playerHealthPercent={playerHealthPercent}
        enemyHitInfo={enemyHitInfo}
        playerHitInfo={playerHitInfo}
        enemyImgId={currentEnemy?.imgId ?? 0}
      />


      <IonContent style={{
        '--background': `url('/images/planets/planet-battle-${0}.webp') 0 0/cover no-repeat`,
      }}>
        <div className="ion-padding fight-narrative">
          {fightNarrative.map((line, index) => (
            <div key={index}>{line}</div>
          ))}

          {!battleActive ? (
            <>
              <div>
                {
                  //*If elite or boss enemy*//
                }
                {currentEnemy?.hidden && playerHealth > 0 ? (
                  <div>
                    Type:
                    <span style={{ color: currentEnemy?.type === 'boss' ? '#FF8000' : '#A335EE' }}>
                      {currentEnemy?.type.toLocaleUpperCase()}
                    </span>
                    <br />
                    Level: <span style={{ fontWeight: 700, marginBottom: 36 }}>
                      {currentEnemy?.level}
                    </span>
                    <br />
                    <IonCardSubtitle style={{ color: 'gold' }}>
                      This enemy has a chance to drop rare loot.
                    </IonCardSubtitle>
                    <p style={{ color: 'red', fontSize: 16, fontWeight: 700 }}>
                      {enemyIntimidation ?? ''}
                    </p>
                  </div>
                ) : <></>}
              </div>

              {!loading ? (
                <div>

                  {playerHealth > 0 ? (
                    <IonButton onClick={startFight} color={currentEnemy?.hidden && !hiddenEnemyConcluded ? 'danger' : 'primary'} style={{ width: '100%', marginTop: 16 }}>
                      <>Fight</>
                    </IonButton>
                  ) : <></>}


                  <IonButton
                    style={{
                      width: '100%', marginTop: 8
                    }}
                    fill="solid"
                    className="corner-border"
                    color="light"
                    onClick={(e) => {
                      e.preventDefault();
                      // we reset to the default enemy before navigating out because this
                      // navigation stack /fight/:id stays alive
                      //
                      getEnemy();
                      resetStats();
                      setFightNarrative([]);
                      history.push(`/explore`);
                    }}
                  >
                    Return
                  </IonButton>
                </div>

              ) : (<IonSpinner />)}

            </>
          ) : (<></>)}

        </div>
        {/* Invisible element at the end of your narratives */}
        <div ref={narrativeEndRef} />
      </IonContent>
    </IonPage >
  );
};

export default BattleTrain;
