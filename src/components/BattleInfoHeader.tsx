import { IonSpinner } from '@ionic/react';
import './BattleInfoHeader.css';
import { IHitInfo } from './BattleLog';

interface IBattleInfoHeaderProps {
  enemyHitInfo: IHitInfo[];  // Now an array of I
  playerHitInfo: IHitInfo[];
  enemyHealthPercent: number;
  playerHealthPercent: number;
  enemyImgId: number;
  loading: boolean;
}


const BattleInfoHeader = ({ loading, enemyHitInfo, playerHitInfo, enemyHealthPercent, playerHealthPercent, enemyImgId }: IBattleInfoHeaderProps) => {
  return (
    <div className="fade-in" style={{
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      <div style={{ width: '50%', position: 'relative', height: 160, overflow: 'hidden' }}>
        <img src="/images/player-placeholder.webp" className="player-image" />
        {loading ? <IonSpinner /> : (
          <>
            <div className="fade-right-overlay"></div>
            <div className="health-bar-container">
              <div className="health-bar player-health" style={{ width: `${playerHealthPercent}%` }}></div>
            </div>
            {playerHitInfo.map(hit => (
              <div className={`hit-number  ${hit.damage === 0 ? "splash-miss" : "splash"}`} key={hit.key}>
                {hit.damage}
              </div>
            ))}
          </>
        )}
      </div>

      <div className="vs-text">VS</div>

      <div style={{ width: '50%', position: 'relative', height: 160, overflow: 'hidden' }}>
        <img src={`/images/enemies/enemy-${enemyImgId}.webp`} className="enemy-image" />
        {loading ? <IonSpinner /> : (
          <>
            <div className="fade-left-overlay"></div>
            <div className="health-bar-container">
              <div className="health-bar enemy-health" style={{ width: `${enemyHealthPercent}%` }}></div>
            </div>
            {enemyHitInfo.map(hit => (
              <div className={`hit-number  ${hit.damage === 0 ? "splash-miss" : "splash"}`} key={hit.key}>
                {hit.damage}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default BattleInfoHeader;
