import { IonCardSubtitle, IonContent, IonList, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useBattleProvider } from '../context/BattleContext';
import { getEnemyTypeColor, getItemGradeColor } from '../functions/GetColor';
import { IEnemy, IEnemy_equipment_weapon, IEquipment, IItem, IPlayer } from '../types/types';
import BattleInfoHeader from './BattleInfoHeader';
import './BattleLog.css';
import createBattleLogMessage from './CreateBattleLog';

// Example of an inline style for demonstration
const style = {
  fightNarrative: { color: '#99cc00', marginBottom: 10 },
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

const BattleLog = () => {
  const { battleState, battleActive } = useBattleProvider();
  const narrativeEndRef = useRef(null);
  const [fightNarrative, setFightNarrative] = useState<ReactElement[]>([]);
  const [playerHitInfo, setPlayerHitInfo] = useState({ damage: null, key: 0 });
  const [enemyHitInfo, setEnemyHitInfo] = useState({ damage: null, key: 0 });

  // Returns some text to describe the enemy's health status
  //
  const returnEnemyShape = (enemyName: string, maxHealth: number, currentHealth: number) => {
    let enemyNameStyled = <span className="enemy-name">{enemyName}</span>;

    if (currentHealth > 0.80 * maxHealth) {
      return <span style={style.goodShape}> {enemyNameStyled}  is in good shape.</span>
    } else if (currentHealth > 0.65 * maxHealth) {
      return <span style={style.reasonableShape}> {enemyNameStyled}  is in reasonable shape.</span>
    } else if (currentHealth > 0.40 * maxHealth) {
      return <span style={style.badShape}> {enemyNameStyled}  is in bad shape.</span>
    } else if (currentHealth > 0.20 * maxHealth) {
      return <span style={style.barelyAlive}> {enemyNameStyled} is barely alive.</span>
    } else if (currentHealth > 0.01 * maxHealth) {
      return <span style={style.barelyAlive}> {enemyNameStyled} is barely hanging on.</span>
    } else {
      return <span style={style.barelyAlive}> {enemyNameStyled} is dead!</span>
    }
  }

  // This returns the color of the health left
  //
  const returnPercentageColor = (health: number) => {
    if (!battleState.player) return;
    const percentage = (health / battleState.player.maxHealth) * 100;
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

  const handleHitMarker = (damage: any, isPlayer: boolean) => {
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


  const generateEndFightBattleStats = (playerWin: boolean, enemy: IEnemy, player: IPlayer, xpReward: number, goldReward: number) => {

    // Add average damage and hit rate to the battleStats logging.
    // and set winnerMessage display
    //
    const averageDamage = battleState.playerBattleLog.hits > 0 ? Math.round(battleState.playerBattleLog.totalDamage / battleState.playerBattleLog.hits) : 0;
    const hitRate = battleState.playerBattleLog.attempts > 0 ? Math.round((battleState.playerBattleLog.hits / battleState.playerBattleLog.attempts) * 100) : 0;

    // The battle stats log
    //
    const battleStatsLogMessage = createBattleLogMessage({ enemy, player, playerWin, stats: { ...battleState.playerBattleLog, xpReward, goldReward, loot: [], averageDamage, hitRate } })

    setFightNarrative(prev => [...prev, battleStatsLogMessage]);
  }

  // Create attack line
  //
  useEffect(() => {
    if (!battleState.attackLog.damage || !battleActive) return;
    const isPlayerAttack = battleState.attackLog.isPlayerAttack;
    const attacker = battleState.attackLog.isPlayerAttack ? battleState.player.entity : battleState.enemy.entity;
    const defender = battleState.attackLog.isPlayerAttack ? battleState.enemy.entity : battleState.player.entity;
    const hitMessage = (
      <div style={style.fightNarrative}>
        <span className={`${isPlayerAttack ? 'player-name' : 'enemy-name'}`}>
          {attacker.name}
        </span> hits
        <span className={`${!isPlayerAttack ? 'player-name' : 'enemy-name'}`}>  {defender.name}
        </span> with its <span style={{ ...style.weaponName, color: getItemGradeColor(isPlayerAttack ? battleState.player.weapon?.grade : 'common' ?? 'common') }}>
          {isPlayerAttack ? battleState.player.weapon?.name : (attacker?.equipment?.weapon as IEnemy_equipment_weapon)?.name}.
        </span>
        <br />
        <span style={isPlayerAttack ? style.playerDamage : style.enemyDamage}>
          ({battleState.attackLog.damage} damage)
        </span>
        <br />
        <span>
          {isPlayerAttack ? returnEnemyShape(battleState.enemy.entity.name, battleState.enemy.maxHealth, battleState.enemy.health) :
            <span style={style.playerHealth}> damage report: {battleState.player.health}/{battleState.player.maxHealth}  <span style={returnPercentageColor(battleState.player.health)}>
              {Math.round((battleState.player.health / battleState.player.maxHealth) * 100)} % left
            </span>
            </span>
          }
        </span>
      </div>
    )

    handleHitMarker(battleState.attackLog.damage, isPlayerAttack)
    setFightNarrative([...fightNarrative, hitMessage]);
  }, [battleState.attackLog])


  useEffect(() => {
    if (battleState.player.health <= 0 || battleState.enemy.health <= 0 && !battleActive) {
      generateEndFightBattleStats(battleState.player.health > 0, battleState.enemy.entity, battleState.player.entity, battleState.playerBattleLog.xpReward, battleState.playerBattleLog.goldReward);
    }
  }, [battleActive])

  // Automatically scroll to the latest narrative entry
  useEffect(() => {
    (narrativeEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' });
  }, [fightNarrative]);

  // Calculate health percentage
  const playerHealthPercent = (battleState.player.health / battleState.player.maxHealth) * 100;
  const enemyHealthPercent = (battleState.enemy.health / battleState.enemy.maxHealth) * 100;

  useIonViewWillEnter(() => {
    setFightNarrative([])
  })

  useIonViewWillLeave(() => {
    setFightNarrative([]);
    setPlayerHitInfo({ damage: null, key: 0 });
    setEnemyHitInfo({ damage: null, key: 0 });
  })

  return (
    <IonContent className="content" style={{
      '--background': `url('/images/planets/planet-battle-1.webp') 0 0/cover no-repeat`,
    }}>
      <BattleInfoHeader
        enemyHealthPercent={enemyHealthPercent ?? 100}
        playerHealthPercent={playerHealthPercent ?? 100}
        enemyHitInfo={enemyHitInfo}
        playerHitInfo={playerHitInfo}
        enemyImgId={battleState.enemy.entity?.imgId ?? 0} loading={!battleState}
      />

      <div style={{ marginTop: 216, marginBottom: 36 }}>
        <IonList className="low-fade" style={{ padding: 16 }}>
          {battleState.enemy.entity.hidden ? (
            <div>
              Type:
              <span style={{ color: getEnemyTypeColor(battleState.enemy.entity.type) }}>
                {battleState.enemy.entity?.type.toLocaleUpperCase()}
              </span>
              <br />
              Level: <span style={{ fontWeight: 700, marginBottom: 36 }}>
                {battleState.enemy.entity?.level}
              </span>
              <br />
              <IonCardSubtitle style={{ color: 'gold' }}>
                This enemy has a chance to drop rare loot.
              </IonCardSubtitle>
              <p style={{ color: 'red', fontSize: 16, fontWeight: 700 }}>
                {battleState.enemy.entity.description ?? ''}
              </p>
            </div>
          ) : <></>}


          {fightNarrative.map((line, index) => (
            <span key={index}>{line}</span>
          ))}

          {/* Invisible element at the end of your narratives */}
          <div ref={narrativeEndRef} />
        </IonList>
      </div>

    </IonContent>
  )
}


export default BattleLog;
