import { IonButton, IonCardSubtitle, IonContent, IonPage, IonSpinner, useIonViewWillEnter, useIonViewWillLeave } from "@ionic/react";
import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useHistory, useRouteMatch } from "react-router";
import * as Realm from 'realm-web';
import BattleInfoHeader from "../../components/BattleInfoHeader";
import createBattleLogMessage from "../../components/CreateBattleLog";
import { useNavigationDisable } from "../../context/DisableNavigationContext";
import { PlayerContext } from "../../context/PlayerContext";
import GetBaseItem from "../../functions/GetBaseItem";
import { GetCombinedEquipmentStatsDetails } from "../../functions/GetCombinedEquipmentStatsDetails";
import { createPlayerOwnedItem } from "../../functions/GetCreatePlayerOwnedItem";
import { getSingleEnemy } from "../../functions/GetEnemies";
import getGoldReward from "../../functions/GetGoldReward";
import { getItemGradeColor } from "../../functions/GetItemGradeColor";
import { GetSpawnHiddenEnemies } from "../../functions/GetSpawnHiddenEnemies";
import getXpReward from "../../functions/GetXpReward";
import { BASE_ATTACK_SPEED, calculateAttackSpeed, calculateDamage, calculateHitChance, calculateMaxHealth } from "../../types/stats";
import { IEnemy, IEnemy_equipment_weapon, IEquipment, IItem, IPlayer, IPlayerOwnedArmor, IPlayerOwnedWeapon } from "../../types/types";
import './BattleTrain.css';

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
  const [battleActive, setBattleActive] = useState<boolean>(false);
  const [playerHitInfo, setPlayerHitInfo] = useState({ damage: null, key: 0 });
  const [enemyHitInfo, setEnemyHitInfo] = useState({ damage: null, key: 0 });
  const [playerNextAttack, setPlayerNextAttack] = useState(BASE_ATTACK_SPEED);
  const [enemyNextAttack, setEnemyNextAttack] = useState(BASE_ATTACK_SPEED);
  const history = useHistory();
  const playerTimerRef = useRef<any>();
  const enemyTimerRef = useRef<any>();
  const narrativeEndRef = useRef(null);
  const match = useRouteMatch<{ id: string, planetImgId: string }>();
  const params: any = match.params;

  const [battleStats, setBattleStats] = useState({
    attempts: 0,
    hits: 0,
    maxHit: 0,
    misses: 0,
    dodges: 0,
    totalDamage: 0
  });

  const setEnemyInState = (enemy: IEnemy) => {
    const enemyHealth = calculateMaxHealth(enemy);
    setCurrentEnemy(enemy);
    setEnemyHealth(enemyHealth);
    setEnemyMaxHealth(enemyHealth);

    if (enemy.hidden) {
      setEnemyIntimidation(enemy.description ?? '');
    }
  }

  const getEnemy = async () => {
    const monsterId = params.id;

    if (monsterId) {
      const enemyData = await getSingleEnemy({ monsterId: monsterId });

      if (enemyData) {
        setEnemyInState(enemyData);
      }
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
    setEnemyIntimidation('');
    setBattleStats({
      attempts: 0,
      hits: 0,
      maxHit: 0,
      misses: 0,
      totalDamage: 0,
      dodges: 0
    });
  }

  const getPlayerEquipment = async () => {
    if (!player) return;
    let totalDefense = 0;
    let totalEvasion = 0;

    if (player.equipment && player.equipment.weapon) {
      if (player.equipment) {
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

  }

  // Returns some text to describe the enemy's health status
  //
  const returnEnemyShape = (enemy: IEnemy, health: number) => {
    let enemyNameStyled = <span className="enemy-name">{enemy.name}</span>;
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
    const percentage = (health / playerMaxHealth) * 100;
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
    }, 2000); // reset after 2 seconds to allow for animation completion
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
    if (!player || !currentEnemy || !battleActive) return;
    const randomNumber = Math.random();

    if (randomNumber <= hitChance) {
      const damageDealt = Math.floor(Math.random() * (maxAttack - minAttack + 1) + minAttack);
      let newPlayerHealth = playerMaxHealth;
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
          <span className={`${isPlayerAttack ? 'player-name' : 'enemy-name'}`}>
            {attacker.name}
          </span> hits
          <span className={`${!isPlayerAttack ? 'player-name' : 'enemy-name'}`}> {defender.name}
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
      handleHit(damageDealt, isPlayerAttack)

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
          <span className={`${isPlayerAttack ? 'player-name' : 'enemy-name'}`}>{attacker.name} </span>
          <span>missed
            <span className={`${!isPlayerAttack ? 'player-name' : 'enemy-name'}`}> {defender.name}
            </span>
          </span>
        </div>
      );

      setFightNarrative(prevNarrative => [...prevNarrative, missMessage]);
      handleHit(0, isPlayerAttack)
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
    // If we fought a hidden enemy and his health is 0
    // we want to make sure we reset the fight to the original
    // enemy when the play clicks start fight again.
    //
    if (currentEnemy?.hidden && (enemyHealth <= 0 || playerHealth <= 0)) {
      getEnemy();
      resetStats();
      setFightNarrative([]);
      return;
    }
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
    let loot: ILootDrop[] = []; // Used for display only
    let goldReward = 0;
    let xpReward = 0;
    let updatedInventory: Realm.BSON.ObjectId[] = [...player.inventory]; // used to update the player context inventory

    if (playerWin) {
      // Create loot chance logic here
      if (enemy.trashLoot) {
        // This is the logic to create "basic item" loot from the fight
        //
        try {
          // Random amount for common loot
          // we handle any other grade of loot inside the createPlayerOwnedItem call
          //
          // Step 1: Create or get the already owned item from the player owned items.
          // reference the trash loot from the monster
          //
          const playerOwnedItemResponse = await createPlayerOwnedItem(player, enemy.trashLoot);
          const baseItem = await GetBaseItem(enemy.trashLoot);
          // Check if the player's inventory already includes this playerOwnedItem.
          //
          const itemInInventoryIndex = player.inventory.findIndex(i => i.toString() === playerOwnedItemResponse?.item._id.toString());

          // if player doesn't own it, push it to the inventory in state
          //
          if (itemInInventoryIndex < 0 && playerOwnedItemResponse) {
            updatedInventory.push(playerOwnedItemResponse.item._id);
          }

          if (baseItem) {
            // Loot is only used for the battle stats table
            // so we can tell the player what he has looted
            //
            loot.push({ item: baseItem, quantity: playerOwnedItemResponse?.quantity ?? 1 })
          }

        } catch (e) {
          console.error(e);
        };
      }

      goldReward = getGoldReward({ enemy: enemy, playerLevel: player.level });
      xpReward = getXpReward({ enemyLevel: enemy.level, enemyType: enemy.type as "standard" | "elite" | "boss", playerLevel: player.level })
    } else {
      goldReward = Math.floor(getGoldReward({ enemy: enemy, playerLevel: player.level }) / 10);
      xpReward = Math.floor(getXpReward({ enemyLevel: enemy.level, enemyType: enemy.type as "standard" | "elite" | "boss", playerLevel: player.level }) / 10);
    }
    // Update the player with all the new data
    // this will update in context & back-end
    //
    await updatePlayerData({ gold: player.gold += goldReward, experience: player.experience += xpReward, inventory: updatedInventory })

    // Add average damage and hit rate to the battleStats logging.
    // and set winnerMessage display
    //
    const averageDamage = battleStats.hits > 0 ? Math.round(battleStats.totalDamage / battleStats.hits) : 0;
    const hitRate = battleStats.attempts > 0 ? Math.round((battleStats.hits / battleStats.attempts) * 100) : 0;

    // The battle stats log
    //
    const battleStatsLogMessage = createBattleLogMessage({ enemy, player, playerWin, stats: { ...battleStats, loot, xpReward, goldReward, averageDamage, hitRate } })

    toast.success(`+ ${goldReward} 🪙`,
      {
        style: {
          borderRadius: 0,
          background: 'black',
          color: '#fff',
        },
      }
    );

    setLoading(false);
    setIsNavigationDisabled(false);
    setFightNarrative(prev => [...prev, battleStatsLogMessage]);
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

  // Initial get enemy
  //
  useIonViewWillEnter(() => {
    getEnemy();
    resetStats();
    setFightNarrative([]);
  })

  useIonViewWillLeave(() => {
    setIsNavigationDisabled(false);
  })

  useEffect(() => {
    if (player) {
      const playerHealth = calculateMaxHealth(player);
      setPlayerMaxHealth(playerHealth);
      setPlayerHealth(playerHealth);
    }
  }, [player?.con]);

  useEffect(() => {
    if (player) {
      getPlayerEquipment();
    }
  }, [player?.equipment]);

  useEffect(() => {
    setLoading(true);
    if (player && playerWeapon && currentEnemy && playerDefensiveStats) {
      setLoading(false);
    }
  }, [player?.equipment, playerWeapon, currentEnemy, playerDefensiveStats]);


  // Automatically scroll to the latest narrative entry
  useEffect(() => {
    (narrativeEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' });
  }, [fightNarrative]);

  // Calculate health percentage
  const playerHealthPercent = (playerHealth / playerMaxHealth) * 100;
  const enemyHealthPercent = (enemyHealth / enemyMaxHealth) * 100;

  return (
    <IonPage className="content">
      {
        //* Battle header enemy vs player *//
      }
      <BattleInfoHeader
        enemyHealthPercent={enemyHealthPercent}
        playerHealthPercent={playerHealthPercent}
        enemyHitInfo={enemyHitInfo}
        playerHitInfo={playerHitInfo}
        enemyImgId={currentEnemy?.imgId ?? 0} loading={!currentEnemy} />

      <IonContent className="content" style={{
        '--background': `url('/images/planets/planet-battle-${params?.planetImgId}.webp') 0 0/cover no-repeat`,
      }}>
        <div className="ion-padding fight-narrative quick-fade-in">
          {fightNarrative.map((line, index) => (
            <div key={index}>{line}</div>
          ))}

          {!battleActive ? (
            <>
              <div>
                {
                  // *If elite or boss enemy *//
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

              <div>
                <IonButton onClick={startFight} disabled={loading} color={currentEnemy?.hidden ? 'danger' : 'primary'} style={{ width: '100%', marginTop: 16 }}>
                  {loading ? <IonSpinner /> : <>Fight</>}
                </IonButton>

                <IonButton
                  style={{
                    width: '100%', marginTop: 8
                  }}
                  fill="solid"
                  className="corner-border"
                  color="light"
                  onClick={(e) => {
                    e.preventDefault();
                    history.replace(`/planet`);
                  }}
                >
                  Return
                </IonButton>
              </div>
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
