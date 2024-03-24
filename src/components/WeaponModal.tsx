import { IonModal, IonGrid, IonRow, IonCol, IonButton, IonImg, IonButtons } from "@ionic/react";
import { IWeapon } from "../types/types";
import './WeaponModal.css';
import getWeaponColor from "../functions/GetWeaponColor";

interface IWeaponModalProps {
  showModal: boolean;
  weapon: IWeapon;
  isForSale: boolean;
  canPurchase: boolean;
  purchaseItem: (weapon: IWeapon) => void;
  equipItem: (weapon: IWeapon) => void;
  setShowModal: (boolean: boolean) => void;
}


const WeaponModal = ({ showModal, weapon,  isForSale, equipItem, canPurchase, purchaseItem, setShowModal }: IWeaponModalProps) => {

  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} initialBreakpoint={1} breakpoints={[0, 1]}>
      <div className="weapon-modal-title">
        Weapon
      </div>
      <div className="weapon-name-title" style={{ color: getWeaponColor(weapon.grade) }}>
        {weapon.name}
      </div>

      <IonGrid style={{ height: '100px', border: '2px solid rgb(89, 59, 47)', margin: "6px 16px 16px 16px" }}>
        <IonRow className="ion-padding">
          <IonImg
            alt={`A ${weapon.name} with beautiful details`}
            src={`/resources/images/weapons/weapon-${weapon.imgId}.webp`}
            style={{ height: 85, marginLeft: 16, border: '1px solid grey' }} />

          <IonCol style={{ marginLeft: 26 }}>
            <IonRow>
              <span style={{ color: getWeaponColor(weapon.grade), fontSize: 12 }}>
                {weapon?.grade?.toUpperCase()}
              </span>
            </IonRow>

            <IonRow>
              <span style={{ fontSize: 50, fontWeight: 900 }}>
                {weapon.minDamage} - {weapon.maxDamage}
              </span>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow className="ion-padding" style={{ color: 'lightgray' }}>
          {weapon.description}
        </IonRow>

        <IonRow className="ion-padding">
          <IonCol>
            {isForSale ? (
              <>
                <h2>Cost</h2>
                <p>{weapon.cost} <span style={{ color: 'gold' }}>Gold</span></p>
              </>

            ) : <></>}

            <h2>Requirements</h2>
            <p>DEX {weapon?.requirements?.dex}, STR {weapon?.requirements?.str}</p>
          </IonCol>
        </IonRow>
      </IonGrid>


      <div className="ion-padding" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {isForSale ? ( 
          <>
            <IonButton fill="solid" disabled={!canPurchase} onClick={() => purchaseItem(weapon)}>Purchase</IonButton>
            <IonButton fill="clear" onClick={() => setShowModal(false)}>Cancel</IonButton>
          </>
        ) : (
          <>
            <IonButton fill="solid"  onClick={() => equipItem(weapon)}>Equip</IonButton>
            <div>
              <IonButton fill="solid" color="warning" onClick={() => setShowModal(false)}>Sale</IonButton>
              <IonButton fill="clear" onClick={() => setShowModal(false)}>Cancel</IonButton>
            </div>
          </>
        )}
      </div>
    </IonModal>
  )
}


export default WeaponModal;