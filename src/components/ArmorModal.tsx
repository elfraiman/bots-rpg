import { IonModal, IonGrid, IonRow, IonCol, IonButton, IonImg, IonButtons } from "@ionic/react";
import { IArmor, IShopArmor, IWeapon } from "../types/types";
import './WeaponModal.css';
import getWeaponColor from "../functions/GetWeaponColor";

interface IArmorModalProps {
  showModal: boolean;
  armor: IArmor;
  isForSale: boolean;
  canPurchase: boolean;
  purchaseItem: (armor: IShopArmor) => void;
  equipItem: (armor: IArmor) => void;
  saleArmor: (armor: IArmor) => void;
  setShowModal: (boolean: boolean) => void;
}


const ArmorModal = ({ showModal, armor,  isForSale, equipItem, canPurchase, purchaseItem, saleArmor, setShowModal }: IArmorModalProps) => {

  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} initialBreakpoint={1} breakpoints={[0, 1]}>
      <div className="weapon-modal-title">
        Armor
      </div>
      <div className="weapon-name-title" style={{ color: getWeaponColor(armor?.grade) }}>
        {armor.name}
      </div>

      <IonGrid style={{ height: '100px', border: '2px solid rgb(89, 59, 47)', margin: "6px 16px 16px 16px" }}>
        <IonRow className="ion-padding">
          <IonImg
            alt={`A ${armor.name} with beautiful details`}
            src={`/resources/images/weapons/weapon-${armor.imgId}.webp`}
            style={{ height: 85, marginLeft: 16, border: '1px solid grey' }} />

          <IonCol style={{ marginLeft: 26 }}>
            <IonRow>
              <span style={{ color: getWeaponColor(armor.grade), fontSize: 12 }}>
                {armor?.grade?.toUpperCase()}
              </span>
            </IonRow>

            <IonRow>
              <span style={{ fontSize: 50, fontWeight: 900 }}>
                {armor.defense}
              </span>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow className="ion-padding" style={{ color: 'lightgray' }}>
          {armor.description}
        </IonRow>

        <IonRow className="ion-padding">
          <IonCol>
            {isForSale ? (
              <>
                <h2>Cost</h2>
                <p>{armor.cost} <span style={{ color: 'gold' }}>Gold</span></p>
              </>

            ) : <></>}

            <h2>Requirements</h2>
            <p>DEX {armor?.requirements?.dex}, STR {armor?.requirements?.str}</p>
          </IonCol>
        </IonRow>
      </IonGrid>


      <div className="ion-padding" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {isForSale ? ( 
          <>
            <IonButton fill="solid" disabled={!canPurchase} onClick={() => purchaseItem(armor as IShopArmor)}>Purchase</IonButton>
            <IonButton fill="clear" onClick={() => setShowModal(false)}>Cancel</IonButton>
          </>
        ) : (
          <>
            <IonButton fill="solid"  onClick={() => equipItem(armor)}>Equip</IonButton>
            <div>
              <IonButton fill="solid" color="warning" onClick={() => saleArmor(armor)}>Sale</IonButton>
              <IonButton fill="clear" onClick={() => setShowModal(false)}>Cancel</IonButton>
            </div>
          </>
        )}
      </div>
    </IonModal>
  )
}


export default ArmorModal;