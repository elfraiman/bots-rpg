import { IonButton, IonCol, IonGrid, IonImg, IonModal, IonRow, IonSpinner } from "@ionic/react";
import getItemGradeColor from "../functions/GetItemGradeColor";
import './EquipmentModal.css';
import { IPlayer } from "../types/types";

interface IEquipmentModalProps {
  showModal: boolean;
  item: any;
  isForSell: boolean;
  player?: IPlayer;
  checkRequirements: boolean;
  imgString: string;
  purchaseItem: (item: any) => void;
  equipItem: (item: any) => void;
  sellItem: (item: any) => void;
  setShowModal: (boolean: boolean) => void;
  loading: boolean;
}


const EquipmentModal = ({ showModal, item, isForSell, checkRequirements, player, imgString, loading, equipItem, purchaseItem, sellItem, setShowModal }: IEquipmentModalProps) => {

  const returnTextForAttackSpeed = (speed: number) => {
    switch (speed) {
      case 1800: return 'Very fast'
      case 2400: return 'Fast'
      case 3000: return 'Normal'
      case 3600: return 'Slow'
      case 4200: return 'Very slow'
    }
  }
  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} initialBreakpoint={1} breakpoints={[0, 1]}>
      <div className="weapon-modal-title">
        {item.type}
      </div>
      <div className="weapon-name-title" style={{ color: getItemGradeColor(item?.grade) }}>
        {item.name}
      </div>

      {loading ? <IonSpinner /> : (
        <IonGrid style={{ height: '100px', border: '2px solid rgb(89, 59, 47)', margin: "6px 16px 16px 16px" }}>
          <IonRow className="ion-padding">
            <IonImg
              alt={`A ${item.name} with beautiful details`}
              src={imgString}
              style={{ height: 85, marginLeft: 16, border: '1px solid grey' }} />

            <IonCol style={{ marginLeft: 26 }}>
              <IonRow>
                <span style={{ color: getItemGradeColor(item.grade), fontSize: 12 }}>
                  {item?.grade?.toUpperCase()}
                </span>
              </IonRow>

              <IonRow>
                <div style={{ fontSize: 50, fontWeight: 900 }}>
                  {item.type === 'weapon' ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{item.stats.minAttack} ~ {item.stats.maxAttack}</span>
                      <span style={{ fontSize: 14, fontWeight: 400 }}> Speed: {returnTextForAttackSpeed(item.stats.attackSpeed)}</span>
                    </div>
                  ) : (
                    <>
                      DP: {item.stats.defense}<br />
                      <span style={{ fontSize: 16 }}>Evasion: {item.stats.evasion}</span>
                    </>
                  )}
                </div>
              </IonRow>
            </IonCol>
          </IonRow>
          <IonRow className="ion-padding" style={{ color: 'lightgray' }}>
            {item.description}
          </IonRow>

          <IonRow className="ion-padding">




            <IonCol>
              {isForSell ? (
                <>
                  <h2>Cost</h2>
                  <p>{item.cost} <span style={{ color: 'gold' }}>Gold</span></p>
                </>
              ) : <></>}

              <h2>Requirements</h2>

              {player ? (
                <div>
                  <span>
                    STR:<span style={{ color: player?.str >= item.requirements.str ? 'green' : 'red', marginRight: 8 }}>
                      {item?.requirements.str}
                    </span>
                  </span>

                  <span>
                    DEX: <span style={{ color: player?.dex >= item.requirements.dex ? 'green' : 'red', marginRight: 8 }}>
                      {item?.requirements.dex}
                    </span>
                  </span>


                  <span>
                    CON: <span style={{ color: player?.con >= item.requirements.con ? 'green' : 'red', marginRight: 8 }}>
                      {item?.requirements.con}
                    </span>
                  </span>

                  <span>
                    INT: <span style={{ color: player?.int >= item.requirements.int ? 'green' : 'red', marginRight: 8 }}>
                      {item?.requirements.int}
                    </span>
                  </span>
                </div>
              ) : <IonSpinner />}

            </IonCol>
          </IonRow>
        </IonGrid>
      )}

      <div className="ion-padding" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {isForSell ? (
          <>
            <IonButton fill="solid" disabled={!checkRequirements || loading} onClick={() => purchaseItem(item as any)}>Purchase</IonButton>
            <IonButton fill="clear" onClick={() => setShowModal(false)}>Cancel</IonButton>
          </>
        ) : (
          <>
            <IonButton fill="solid" disabled={loading || !checkRequirements} onClick={() => equipItem(item._id)}>Equip</IonButton>
            <div>
              <IonButton fill="solid" disabled={loading} color="warning" onClick={() => sellItem(item)}>Sell</IonButton>
              <IonButton fill="clear" onClick={() => setShowModal(false)}>Cancel</IonButton>
            </div>
          </>
        )}
      </div>
    </IonModal>
  )
}


export default EquipmentModal;