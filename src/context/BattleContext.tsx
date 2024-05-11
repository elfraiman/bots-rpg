
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePlayer } from './PlayerContext';
import { BASE_ATTACK_SPEED, calculateAttackSpeed, calculateDamage, calculateHitChance, calculateMaxHealth, playerEquipmentStats } from '../types/stats';
import { IEnemy, IEnemy_equipment_weapon, IEquipment, IItem, IPlayer, IPlayerOwnedWeapon } from '../types/types';
import toast from 'react-hot-toast';
import GetBaseItem from '../functions/GetBaseItem';
import { createPlayerOwnedItem } from '../functions/GetCreatePlayerOwnedItem';
import getGoldReward from '../functions/GetGoldReward';
import getXpReward from '../functions/GetXpReward';
import * as Realm from 'realm-web';
import { chanceToSpawnHiddenEnemies } from '../functions/ChanceToSpawnHiddenEnemies';
import { useNavigationDisable } from './DisableNavigationContext';
import { useDungeonEnemyListProvider } from './DungeonEnemyListContext';


interface IPlayerDefensiveStats {
  evasion: number;
  defense: number;
}

interface IAttackResult {
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
// Define the shape of the context
interface IBattleContext {
  setBattleActive: React.Dispatch<React.SetStateAction<boolean>>;
  battleActive: boolean;
  setEnemy: React.Dispatch<React.SetStateAction<IEnemy | undefined>>;
  doubleAttack: () => void;
  battleState: {
    player: {
      entity: IPlayer;
      weapon: IPlayerOwnedWeapon;
      defensiveStats: IPlayerDefensiveStats;
      maxHealth: number;
      health: number;
      playerNextAttackTime: number;
    };
    enemy: {
      entity: IEnemy
      weapon: IEnemy_equipment_weapon;
      defensiveStats: any;
      maxHealth: number;
      health: number;
      enemyNextAttackTime: number;
    };
    playerBattleLog: {
      attempts: number;
      hits: number;
      hitRate: number;
      maxHit: number;
      misses: number;
      dodges: number;
      totalDamage: number;
      averageDamage: number;
      xpReward: number;
      goldReward: number;
    },
    attackLog: {
      isPlayerAttack: boolean;
      damage: number;
      battleEnd: boolean;
    }
  };
  // Add any function to change this state if needed
}

const defaultContext: IBattleContext = {
  setBattleActive: () => false,
  setEnemy: () => { },
  doubleAttack: () => { },
  battleActive: false,
  battleState: {
    player: {
      entity: {} as IPlayer,
      weapon: {} as IPlayerOwnedWeapon,
      defensiveStats: {
        evasion: 0,
        defense: 0,
      },
      maxHealth: 0,
      health: 0,
      playerNextAttackTime: BASE_ATTACK_SPEED
    },
    enemy: {
      entity: {} as IEnemy,
      weapon: {} as IEnemy_equipment_weapon,
      defensiveStats: {},
      maxHealth: 0,
      health: 0,
      enemyNextAttackTime: BASE_ATTACK_SPEED
    },
    playerBattleLog: {
      attempts: 0,
      hits: 0,
      hitRate: 0,
      maxHit: 0,
      misses: 0,
      dodges: 0,
      totalDamage: 0,
      averageDamage: 0,
      xpReward: 0,
      goldReward: 0,
    },
    attackLog: {
      isPlayerAttack: false,
      damage: 0,
      battleEnd: false
    }
  },
}

// Create the context
export const BattleContext = createContext<IBattleContext>(defaultContext);

// Create a provider component
export const BattleProvider = ({ children }: { children: ReactNode }) => {
  const playerTimerRef = useRef<any>();
  const enemyTimerRef = useRef<any>();
  const { player, updatePlayerData } = usePlayer();
  const [battleActive, setBattleActive] = useState<boolean>(false);
  const { removeEnemy, enemyList } = useDungeonEnemyListProvider();
  const [enemy, setEnemy] = useState<IEnemy>();
  const [battleState, setBattleState] = useState({
    player: {
      entity: {} as IPlayer,
      weapon: {} as IPlayerOwnedWeapon,
      defensiveStats: {
        evasion: 0,
        defense: 0,
      } as IPlayerDefensiveStats,
      maxHealth: 0,
      health: 0,
      playerNextAttackTime: BASE_ATTACK_SPEED
    },
    enemy: {
      entity: {} as IEnemy,
      weapon: {} as IEnemy_equipment_weapon,
      defensiveStats: {},
      maxHealth: 0,
      health: 0,
      enemyNextAttackTime: BASE_ATTACK_SPEED
    },
    playerBattleLog: {
      attempts: 0,
      hits: 0,
      hitRate: 0,
      maxHit: 0,
      misses: 0,
      dodges: 0,
      totalDamage: 0,
      averageDamage: 0,
      xpReward: 0,
      goldReward: 0,
    },
    attackLog: {
      isPlayerAttack: false,
      damage: 0,
      battleEnd: false
    },
  });
  const [coolDown, setCoolDown] = useState<boolean>(false);

  const { setIsNavigationDisabled } = useNavigationDisable();


  //* Player Active Skills */
  const doubleAttack = () => {
    attack(true);
    setTimeout(() => {
      attack(true);
    }, 800)
  };













  const endBattle = async (playerWin: boolean) => {
    if (!player || !enemy) return;

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
      goldReward = Math.floor(getGoldReward({ enemy: enemy, playerLevel: player.level }) / 8);
      xpReward = Math.floor(getXpReward({ enemyLevel: enemy.level, enemyType: enemy.type as "standard" | "elite" | "boss", playerLevel: player.level }) / 10);
    }
    // Update the player with all the new data
    // this will update in context & back-end
    //
    await updatePlayerData({
      gold: player.gold += goldReward,
      experience: player.experience += xpReward,
      inventory: updatedInventory
    }).then(() => {
      // end of fight stats
      //
      setBattleState(prevState => ({
        ...prevState,
        playerBattleLog: {
          ...prevState.playerBattleLog,
          xpReward,
          goldReward,
          loot
        },
        attackLog: {
          ...prevState.attackLog,
          battleEnd: true
        }
      }))
      toast.success(`+ ${goldReward} 🪙`,
        {
          style: {
            borderRadius: 0,
            background: 'black',
            color: '#fff',
          },
        }
      );

    }).catch(e => {
      toast.error(`Error updating player after fight ${e}`,
        {
          style: {
            borderRadius: 0,
            background: 'black',
            color: '#fff',
          },
        })
    }).finally(() => {
      setBattleActive(false);
      setIsNavigationDisabled(false);
    })
  }

  const spawnHiddenEnemy = async () => {
    // if we are currently fighting a dungeon enemy we don't want to
    // spawn hidden enemies.
    //
    if (!enemy || !player || enemy.dungeonEnemy) return;

    // Try to spawn hidden enemies (Elites, Bosses) based on their spawn chance
    // and the players planet location
    //
    const spawnHiddenEnemies = await chanceToSpawnHiddenEnemies(player.location);

    if (spawnHiddenEnemies.length > 0 && !enemy.hidden) {
      // Find the enemy with the lowest chanceToEncounter, treating undefined as 1 (or another high value indicating very common)
      const chooseRarestEnemy = spawnHiddenEnemies.reduce((rarest, current) => {
        const rarestChance = rarest.chanceToEncounter !== undefined ? rarest.chanceToEncounter : 1;
        const currentChance = current.chanceToEncounter !== undefined ? current.chanceToEncounter : 1;
        return currentChance < rarestChance ? current : rarest;
      }, spawnHiddenEnemies[0]);

      if (chooseRarestEnemy) {
        return chooseRarestEnemy;
      } else {
        return false;
      }
    }
  }

  const attack = (isPlayerAttack: boolean, damage?: number) => {
    if (!player || !enemy || battleState.player.health <= 0 || battleState.enemy.health <= 0) {
      return;
    }

    const enemyWeapon = battleState.enemy.weapon;
    const playerWeapon = battleState.player.weapon;
    const playerDefensiveStats = battleState.player.defensiveStats;
    // Hit chance calculate
    //
    const hitChance = isPlayerAttack ?
      calculateHitChance(player.dex, enemy.dex)
      :
      calculateHitChance(enemy.dex, player.dex, playerDefensiveStats.evasion);

    // Damage calculate
    //
    const damageNumbers = isPlayerAttack ?
      calculateDamage(battleState.player.weapon.stats.minAttack, playerWeapon.stats.maxAttack, player.str, 0)
      :
      calculateDamage(enemyWeapon.stats.minAttack, enemyWeapon.stats.maxAttack, enemy.str, playerDefensiveStats.defense);

    attackResult({
      hitChance,
      minAttack: damageNumbers.minAttack,
      maxAttack: damageNumbers.maxAttack,
      attacker: isPlayerAttack ? player : enemy,
      defender: isPlayerAttack ? enemy : player,
      isPlayerAttack: isPlayerAttack
    }, isPlayerAttack);
  };

  const attackResult = (attackResult: IAttackResult, isPlayerAttack: boolean) => {
    if (!player || !enemy || !battleActive) return;
    const { hitChance, minAttack, maxAttack } = attackResult;

    const randomNumber = Math.random();

    if (randomNumber <= hitChance) {
      const damageDealt = Math.floor(Math.random() * (maxAttack - minAttack + 1)) + minAttack;
      let newPlayerHealth = battleState.player.health;
      let newEnemyHealth = battleState.enemy.health;

      if (isPlayerAttack) {
        newEnemyHealth = Math.max(battleState.enemy.health - damageDealt, 0);
        setBattleState(prevState => ({
          ...prevState,
          enemy: {
            ...prevState.enemy,
            health: newEnemyHealth
          },
          attackLog: {
            ...prevState.attackLog,
            isPlayerAttack: true,
            damage: damageDealt
          }
        }))
      } else {
        newPlayerHealth = Math.max(battleState.player.health - damageDealt, 0);
        setBattleState(prevState => ({
          ...prevState,
          player: {
            ...prevState.player,
            health: newPlayerHealth
          },
          attackLog: {
            ...prevState.attackLog,
            isPlayerAttack: false,
            damage: damageDealt
          }
        }))
      }

      if (isPlayerAttack) {
        // Add to log if hit
        setBattleState(prevState => ({
          ...prevState,
          playerBattleLog: {
            ...prevState.playerBattleLog,
            attempts: prevState.playerBattleLog.attempts + 1,
            hits: prevState.playerBattleLog.hits + 1,
            maxHit: Math.max(prevState.playerBattleLog.maxHit, damageDealt),
            totalDamage: prevState.playerBattleLog.totalDamage + damageDealt,
          }
        }));
      }
    } else {
      // add to log if miss
      if (isPlayerAttack) {
        setBattleState(prevState => ({
          ...prevState,
          attempts: prevState.playerBattleLog.attempts + 1,
          misses: prevState.playerBattleLog.misses + 1,
        }));
      } else {
        // player dodged
        setBattleState(prevState => ({
          ...prevState,
          playerBattleLog: {
            ...prevState.playerBattleLog,
            dodges: prevState.playerBattleLog.dodges + 1,
          }
        }));
      }
    }

  }

  const resetBattleState = () => {
    setBattleState({
      player: {
        weapon: {
          name: "default",
          grade: 'common',
          stats: {
            minAttack: 0,
            maxAttack: 0,
            attackSpeed: 3600,
            modifier: ''
          }
        } as IPlayerOwnedWeapon,
        defensiveStats: {
          evasion: 0,
          defense: 0,
        } as IPlayerDefensiveStats,
        maxHealth: 0,
        health: 0,
        playerNextAttackTime: BASE_ATTACK_SPEED,
        entity: {} as IPlayer
      },
      enemy: {
        weapon: {
          name: 'Default',
          stats: {
            minAttack: 0,
            maxAttack: 0,
            attackSpeed: 3600,
          }
        },
        defensiveStats: {},
        maxHealth: 0,
        health: 0,
        enemyNextAttackTime: BASE_ATTACK_SPEED,
        entity: {} as IEnemy
      },
      playerBattleLog: {
        attempts: 0,
        hits: 0,
        hitRate: 0,
        maxHit: 0,
        misses: 0,
        dodges: 0,
        totalDamage: 0,
        averageDamage: 0,
        xpReward: 0,
        goldReward: 0,
      },
      attackLog: {
        isPlayerAttack: false,
        damage: 0,
        battleEnd: false
      }
    })
  }

  const setupNpcEnemy = async () => {
    const hiddenEnemySpawned = await spawnHiddenEnemy();
    const targetEnemy = hiddenEnemySpawned ? hiddenEnemySpawned : enemy;

    if (!targetEnemy) return;
    const enemyHealth = calculateMaxHealth(targetEnemy);
    const enemyWeapon = targetEnemy.equipment.weapon;
    setBattleState(prevState => ({
      ...prevState,
      enemy: {
        ...prevState.enemy,
        entity: { ...targetEnemy },
        weapon: enemyWeapon,
        maxHealth: enemyHealth,
        health: enemyHealth
      }
    }));
  };

  const setupPlayer = async () => {
    if (!player) return;
    const details = await playerEquipmentStats(player);
    const playerHealth = calculateMaxHealth(player);

    if (details && player) {
      setBattleState(prevState => ({
        ...prevState,
        player: {
          ...prevState.player,
          entity: { ...player },
          weapon: details.weapon,
          defensiveStats: details.defensive,
          maxHealth: playerHealth,
          health: playerHealth
        }
      }));
    } else {
      toast.error("Error setting up player for battle");
    }
  };

  useEffect(() => {
    if (!player || !enemy || !battleState.player.entity || !battleActive || !battleState.player.weapon.stats || !battleState.enemy.weapon.stats) return;

    const playerState = battleState.player;
    const enemyState = battleState.enemy;

    const playerAttackSpeed =
      calculateAttackSpeed(playerState.weapon.stats.attackSpeed, player.dex);
    const enemyAttackSpeed =
      calculateAttackSpeed(enemyState.weapon.stats.attackSpeed ?? BASE_ATTACK_SPEED, enemy.dex);

    // Schedule the next player attack
    //
    const schedulePlayerAttack = () => {
      const delay = playerState.playerNextAttackTime - Date.now();
      return setTimeout(() => {
        attack(true);
        setBattleState(prevState => ({
          ...prevState,
          player: {
            ...prevState.player,
            playerNextAttackTime: Date.now() + playerAttackSpeed
          }
        }));
      }, delay > 0 ? delay : 0); // Ensure delay is not negative
    };

    // Schedule the next enemy attack
    //
    const scheduleEnemyAttack = () => {
      const delay = enemyState.enemyNextAttackTime - Date.now();
      return setTimeout(() => {
        attack(false);
        setBattleState(prevState => ({
          ...prevState,
          enemy: {
            ...prevState.enemy,
            enemyNextAttackTime: Date.now() + enemyAttackSpeed
          }
        }));
      }, delay > 0 ? delay : 0); // Ensure delay is not negative
    };

    const playerTimer = schedulePlayerAttack();
    const enemyTimer = scheduleEnemyAttack();

    // Assign timers to refs for later cleanup
    playerTimerRef.current = playerTimer;
    enemyTimerRef.current = enemyTimer;

    if (playerState.health <= 0 || enemyState.health <= 0) {
      clearTimeout(playerTimer);
      clearTimeout(enemyTimer);

      if (playerState.health <= 0) {
        endBattle(false);
      } else {
        endBattle(true);
      }
    }

    return () => {
      if (playerTimerRef.current) clearTimeout(playerTimerRef.current);
      if (enemyTimerRef.current) clearTimeout(enemyTimerRef.current);
    };
  }, [
    battleActive,
    battleState.player.playerNextAttackTime,
    battleState.enemy.enemyNextAttackTime,
  ]);

  useEffect(() => {
    if (enemy && player) {
      setupNpcEnemy();
      setupPlayer();
    }

    return () => {
      resetBattleState();
    }
  }, [enemy])

  useEffect(() => {
    if (player && enemy && battleState.player.entity.name && !battleState.enemy.entity.hidden) {
      console.log(battleState.player, ' battleState.player')

      setTimeout(() => {
        setBattleActive(true);
        setIsNavigationDisabled(true);
      }, 1000);
    }
  }, [battleState.player.entity])

  return (
    <BattleContext.Provider value={{ setBattleActive, setEnemy, battleState, battleActive, doubleAttack }}>
      {children}
    </BattleContext.Provider>
  );
};

// Custom hook to use the splash screen context
export const useBattleProvider = () => {
  const context = useContext(BattleContext);
  if (context === undefined) {
    throw new Error('useBattleProvider must be used within a BattleProvider');
  }
  return context;
};
