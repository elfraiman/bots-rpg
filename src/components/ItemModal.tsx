import { IonButton, IonCol, IonGrid, IonImg, IonModal, IonRow } from "@ionic/react";
import getItemGradeColor from "../functions/GetWeaponColor";
import './ItemModal.css';

interface IItemModalProps {
  showModal: boolean;
  item: any;
  isForSale: boolean;
  canPurchase: boolean;
  imgString: string;
  purchaseItem: (item: any) => void;
  equipItem: (item: any) => void;
  saleItem: (item: any) => void;
  setShowModal: (boolean: boolean) => void;
}


const ItemModal = ({ showModal, item, isForSale, equipItem, canPurchase, purchaseItem, saleItem, setShowModal, imgString }: IItemModalProps) => {

  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} initialBreakpoint={1} breakpoints={[0, 1]}>
      <div className="weapon-modal-title">
        Armor
      </div>
      <div className="weapon-name-title" style={{ color: getItemGradeColor(item?.grade) }}>
        {item.name}
      </div>

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
              <span style={{ fontSize: 50, fontWeight: 900 }}>
                {item.minDamage ? (
                  <>
                    {item.minDamage} - {item.maxDamage}
                  </>
                ) : (
                  <>
                    {item.defense}
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


      <div className="ion-padding" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {isForSale ? (
          <>
            <IonButton fill="solid" disabled={!canPurchase} onClick={() => purchaseItem(item as any)}>Purchase</IonButton>
            <IonButton fill="clear" onClick={() => setShowModal(false)}>Cancel</IonButton>
          </>
        ) : (
          <>
            <IonButton fill="solid" onClick={() => equipItem(item)}>Equip</IonButton>
            <div>
              <IonButton fill="solid" color="warning" onClick={() => saleItem(item)}>Sale</IonButton>
              <IonButton fill="clear" onClick={() => setShowModal(false)}>Cancel</IonButton>
            </div>
          </>
        )}
      </div>
    </IonModal>
  )
}


export default ItemModal;