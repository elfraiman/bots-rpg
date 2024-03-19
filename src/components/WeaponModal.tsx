import { IonModal, IonGrid, IonRow, IonCol, IonButton, IonImg, IonButtons } from "@ionic/react";
import { IWeapon } from "../types/types";
import './WeaponModal.css';
import UseWeaponColor from "../hooks/UseWeaponColor";

interface IWeaponModalProps {
  showModal: boolean;
  weapon: IWeapon;
  isForSale: boolean;
  canPurchase: boolean;
  purchaseItem: (weapon: IWeapon) => void;
  setShowModal: (boolean: boolean) => void;
  presentingElement: HTMLElement | null;
}


const WeaponModal = ({ showModal, weapon, presentingElement, isForSale, canPurchase, purchaseItem, setShowModal }: IWeaponModalProps) => {

  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} presentingElement={presentingElement!}>
      <div className="weapon-modal-title">
        Weapon
      </div>
      <div className="weapon-name-title" style={{ color: UseWeaponColor(weapon.grade) }}>
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
              <span style={{ color: UseWeaponColor(weapon.grade), fontSize: 12 }}>
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

        {isForSale ? (
          <IonRow className="ion-padding">
            <IonCol>
              <h2>Cost</h2>
              <p>{weapon.cost} <span style={{ color: 'gold' }}>Gold</span></p>
              <h2>Requirements</h2>
              <p>DEX {weapon?.requirements?.dex}, STR {weapon?.requirements?.str}</p>
            </IonCol>
          </IonRow>
        ) : <></>}


      </IonGrid>


      <IonButtons className="ion-padding" style={{ display: 'flex', justifyContent: "space-between" }}>
        <IonButton size="large" fill="solid" disabled={!canPurchase} onClick={() => purchaseItem(weapon)}>Purchase</IonButton>
        <IonButton size="large" fill="outline" onClick={() => setShowModal(false)}>Cancel</IonButton>
      </IonButtons>
    </IonModal>
  )
}


export default WeaponModal;