import './BattleInfoHeader.css';

interface IBattleInfoHeaderProps {
  enemyHitInfo: any;
  playerHitInfo: any;
  enemyHealthPercent: number;
  playerHealthPercent: number;
  enemyImgId: number;
}


const BattleInfoHeader = ({ enemyHitInfo, playerHitInfo, enemyHealthPercent, playerHealthPercent, enemyImgId }: IBattleInfoHeaderProps) => {


  return (
    <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between', width: '100%', maxHeight: '200px', position: 'relative' }}>
      <div style={{ width: '50%', position: 'relative' }}>
        <img src="/images/player-placeholder.webp" className="player-image" />
        <div className="fade-right-overlay"></div>
        <div className="health-bar-container">
          <div className="health-bar player-health" style={{ width: `${playerHealthPercent}%` }}></div>
        </div>
        {enemyHitInfo.damage && (
          <div className="hit-number" style={{ color: 'red' }} key={enemyHitInfo.key}>
            {enemyHitInfo.damage}
          </div>
        )}
      </div>
      <div className="vs-text">
        VS
      </div>
      <div style={{ width: '50%', position: 'relative' }}>
        <img src={`/images/enemies/enemy-${enemyImgId}.webp`} className="enemy-image" />

        <div className="fade-left-overlay"></div>
        <div className="health-bar-container">
          <div className="health-bar enemy-health" style={{ width: `${enemyHealthPercent}%` }}></div>
        </div>

        {playerHitInfo.damage && (
          <div className="hit-number" style={{ color: 'red' }} key={playerHitInfo.key}>
            {playerHitInfo.damage}
          </div>
        )}
      </div>
    </div>
  )
}

export default BattleInfoHeader;