import { IonButton, IonCol, IonGrid, IonImg, IonModal, IonRange, IonRow, IonSpinner, useIonToast } from "@ionic/react";
import { useState } from "react";
import { getItemGradeColor } from "../functions/GetItemGradeColor";
import { IPlayerOwnedItem } from "../types/types";

interface IEquipmentModalProps {
  showModal: boolean;
  item: IPlayerOwnedItem;
  imgString: string;
  sellItem: (item: IPlayerOwnedItem, sellQuantity: number) => void;
  setShowModal: (boolean: boolean) => void;
  loading: boolean;
}


const GeneralItemModal = ({ showModal, item, sellItem, setShowModal, imgString, loading }: IEquipmentModalProps) => {
  const [totalSellValue, setTotalSellValue] = useState(item.cost);
  const [sellQuantity, setSellQuantity] = useState(1);

  const customFormatter = (value: number): string => {
    // Calculate the selected quantity as a percentage of the maxQuantity
    // value / 100 gives the percentage, and multiplying by maxQuantity
    // gives the actual quantity value based on that percentage
    const quantity = Math.round((value / 100) * item.quantity);

    // Ensure the quantity is at least 1 (or adjust according to your requirements)
    const adjustedQuantity = Math.max(1, quantity);

    // Format the adjusted quantity for display
    setTotalSellValue((adjustedQuantity * item.cost));
    setSellQuantity(adjustedQuantity);
    return adjustedQuantity.toString();
  }

  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} initialBreakpoint={1} breakpoints={[0, 1]}>
      <div className="weapon-name-title" style={{ color: getItemGradeColor(item?.grade ?? 'common') }}>
        {item.name}
      </div>


      <IonGrid style={{ height: '100px', border: `1px solid ${getItemGradeColor(item.grade ?? 'common')}`, margin: "6px 16px 16px 16px" }}>
        <IonRow className="ion-padding">
          <IonImg
            alt={`A ${item.name} with beautiful details`}
            src={imgString}
            style={{ height: 85, marginLeft: 16, border: '1px solid grey' }} />

          <IonCol style={{ marginLeft: 26 }}>
            <IonRow>
              <span style={{ color: getItemGradeColor(item.grade ?? 'common'), fontSize: 12 }}>
                {item?.grade?.toUpperCase()}
              </span>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow className="ion-padding" style={{ color: 'lightgray' }}>
          {item.description}
        </IonRow>

        <IonRow className="ion-padding">
          <IonCol>
            <h2>Cost</h2>
            <p>{item.cost} <span style={{ color: 'gold' }}>🪙</span></p> <></>
          </IonCol>
        </IonRow>

        {item.quantity > 1 ? (
          <>
            {loading ? <IonSpinner /> : (
              <>
                <IonRow className='ion-padding'>
                  <IonRange label={'Quantity'} labelPlacement="start" aria-label="Range with pin" pin={true} pinFormatter={customFormatter} defaultValue={0}>
                  </IonRange>
                </IonRow>
                <IonRow className="ion-padding">Total value: {totalSellValue.toLocaleString()}
                  <span style={{ color: 'gold' }}>🪙</span>
                </IonRow>
              </>
            )}
          </>
        ) : (<></>)}
      </IonGrid>


      <div className="ion-padding" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <>
          <IonButton fill="solid" disabled={loading} onClick={() => sellItem(item, sellQuantity)}>Sell</IonButton>
          <IonButton fill="clear" onClick={() => setShowModal(false)}>Cancel</IonButton>
        </>
      </div>
    </IonModal>
  )
}


export default GeneralItemModal;