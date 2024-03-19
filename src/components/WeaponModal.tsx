import { IonModal, IonGrid, IonRow, IonCol, IonButton, IonImg } from "@ionic/react";
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
}


const WeaponModal = ({ showModal, weapon, isForSale, canPurchase, purchaseItem, setShowModal }: IWeaponModalProps) => {

  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} style={{ padding:'6px', border: `5px solid ${UseWeaponColor(weapon.grade)}` }}>
      <div className="weapon-modal-title">
        Weapon
      </div>
      <div className="weapon-name-title" style={{ color: UseWeaponColor(weapon.grade) }}>
        {weapon.name}
      </div>

      <IonGrid style={{ height: '100px', border: '2px solid rgb(89, 59, 47)', }}>
        <IonRow className="ion-padding">
          <IonImg
            alt={`A ${weapon.name} with beautiful details`}
            src={`/resources/images/weapons/weapon-${weapon.imgId}.webp`}
            style={{ height: 85, marginLeft: 16, border: '1px solid grey' }} />

          <IonCol style={{marginLeft: 26}}>
            <IonRow>
              <span style={{ color: UseWeaponColor(weapon.grade), fontSize: 12 }}>
                {weapon.grade.toUpperCase()}
              </span>
            </IonRow>

            <IonRow>
              <span style={{ fontSize: 50, fontWeight: 900 }}>
                {weapon.minDamage} - {weapon.maxDamage}
              </span>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow className="ion-padding" style={{color: 'lightgray'}}>
          {weapon.description}
        </IonRow>
      </IonGrid>


      <IonGrid>
        <IonRow>
          <IonCol>
            <h2>{weapon.name}</h2>
            <p>Cost: {weapon.cost} Gold</p>
            <p>Damage: {weapon.minDamage}-{weapon.maxDamage}</p>
            <p>Requirements: DEX {weapon?.requirements?.dex}, STR {weapon?.requirements?.str}</p>
            <IonButton disabled={!canPurchase} onClick={() => purchaseItem(weapon)}>Confirm Purchase</IonButton>
            <IonButton onClick={() => setShowModal(false)}>Cancel</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonModal>
  )
}


export default WeaponModal;