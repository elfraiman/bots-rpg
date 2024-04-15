import { IonSpinner } from '@ionic/react';
import './BattleInfoHeader.css';

interface IBattleInfoHeaderProps {
  enemyHitInfo: any;
  playerHitInfo: any;
  enemyHealthPercent: number;
  playerHealthPercent: number;
  enemyImgId: number;
  loading: boolean;
}


const BattleInfoHeader = ({ loading, enemyHitInfo, playerHitInfo, enemyHealthPercent, playerHealthPercent, enemyImgId }: IBattleInfoHeaderProps) => {

  return (
    <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between', width: '100%', maxHeight: '200px', position: 'relative' }}>
      <div style={{ width: '50%', position: 'relative', minHeight: 200 }}>
        <img src="/images/player-placeholder.webp" className="player-image quick-fade-in" />
        {loading ? <IonSpinner /> : (
          <>
            <div className="fade-right-overlay"></div>
            <div className="health-bar-container">
              <div className="health-bar player-health" style={{ width: `${playerHealthPercent}%` }}></div>
            </div>
            {enemyHitInfo.damage >= 0 && (
              <div className={`hit-number  ${enemyHitInfo.damage === 0 ? "splash-miss" : "splash"}`} key={enemyHitInfo.key}>
                {enemyHitInfo.damage}
              </div>
            )}
          </>
        )}
      </div>

      <div className="vs-text">
        VS
      </div>

      <div style={{ width: '50%', position: 'relative', minHeight: 200 }}>

        <img src={loading ? `/images/placeholder.webp` : `/images/enemies/enemy-${enemyImgId}.webp`} className="enemy-image quick-fade-in" style={{ height: '100%' }} />
        {loading ? <IonSpinner /> : (
          <>
            <div className="fade-left-overlay"></div>
            <div className="health-bar-container">
              <div className="health-bar enemy-health" style={{ width: `${enemyHealthPercent}%` }}></div>
            </div>

            {playerHitInfo.damage >= 0 && (

              <div className={`hit-number  ${playerHitInfo.damage === 0 ? "splash-miss" : "splash"}`} key={playerHitInfo.key}>
                {playerHitInfo.damage}
              </div>
            )}
          </>
        )}

      </div>
    </div >
  )
}

export default BattleInfoHeader;