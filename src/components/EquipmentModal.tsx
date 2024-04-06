import { IonButton, IonCol, IonGrid, IonImg, IonModal, IonRow, IonSpinner } from "@ionic/react";
import GetItemGradeColor from "../functions/GetItemGradeColor";
import './EquipmentModal.css';

interface IEquipmentModalProps {
  showModal: boolean;
  item: any;
  isForSale: boolean;
  canPurchase: boolean;
  imgString: string;
  purchaseItem: (item: any) => void;
  equipItem: (item: any) => void;
  saleItem: (item: any) => void;
  setShowModal: (boolean: boolean) => void;
  loading: boolean;
}


const EquipmentModal = ({ showModal, item, isForSale, equipItem, canPurchase, purchaseItem, saleItem, setShowModal, imgString, loading }: IEquipmentModalProps) => {

  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} initialBreakpoint={1} breakpoints={[0, 1]}>
      <div className="weapon-modal-title">
        {item.type}
      </div>
      <div className="weapon-name-title" style={{ color: GetItemGradeColor(item?.grade) }}>
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
                <span style={{ color: GetItemGradeColor(item.grade), fontSize: 12 }}>
                  {item?.grade?.toUpperCase()}
                </span>
              </IonRow>

              <IonRow>
                <span style={{ fontSize: 50, fontWeight: 900 }}>
                  {item.type === 'weapon' ? (
                    <>
                      {item.stats.minAttack} ~ {item.stats.maxAttack}
                    </>
                  ) : (
                    <>
                      DP: {item.stats.defense}<br />
                      <span style={{ fontSize: 16 }}>Evasion: {item.stats.evasion}</span>
                    </>
                  )}
                </span>
              </IonRow>
            </IonCol>
          </IonRow>
          <IonRow className="ion-padding" style={{ color: 'lightgray' }}>
            {item.description}
          </IonRow>

          <IonRow className="ion-padding">
            <IonCol>
              {isForSale ? (
                <>
                  <h2>Cost</h2>
                  <p>{item.cost} <span style={{ color: 'gold' }}>Gold</span></p>
                </>

              ) : <></>}

              <h2>Requirements</h2>
              <p>DEX {item?.requirements?.dex}, STR {item?.requirements?.str}</p>
            </IonCol>
          </IonRow>
        </IonGrid>
      )}

      <div className="ion-padding" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {isForSale ? (
          <>
            <IonButton fill="solid" disabled={!canPurchase || loading} onClick={() => purchaseItem(item as any)}>Purchase</IonButton>
            <IonButton fill="clear" onClick={() => setShowModal(false)}>Cancel</IonButton>
          </>
        ) : (
          <>
            <IonButton fill="solid" disabled={loading} onClick={() => equipItem(item._id)}>Equip</IonButton>
            <div>
              <IonButton fill="solid" disabled={loading} color="warning" onClick={() => saleItem(item)}>Sale</IonButton>
              <IonButton fill="clear" onClick={() => setShowModal(false)}>Cancel</IonButton>
            </div>
          </>
        )}
      </div>
    </IonModal>
  )
}


export default EquipmentModal;