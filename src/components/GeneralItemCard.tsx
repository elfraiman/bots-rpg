import { IonButton, IonCol, IonGrid, IonImg, IonRow, IonSpinner, useIonActionSheet } from "@ionic/react";
import { useContext, useRef, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import getItemGradeColor from "../functions/GetItemGradeColor";
import { getSaleItem } from "../functions/GetSaleItem";
import { IItem, IPlayerOwnedItem } from "../types/types";
import ItemModal from "./ItemModal";

interface IBootsCardProps {
  item: IPlayerOwnedItem;
  isForSale?: boolean;
}

const GeneralItemCard = ({ item, isForSale }: IBootsCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { player, updatePlayerData } = useContext(PlayerContext);

  if (item._id === undefined) {
    console.error("No id on item");
    return;
  }


  const saleItem = async (item: IPlayerOwnedItem, sellQuantity: number) => {
    if (player) {
      await getSaleItem(item, sellQuantity, updatePlayerData, player);

      setShowModal(false);
    }
  }


  return (
    <>
      {item && player ? (
        <>
          <div onClick={() => setShowModal(true)} style={{ padding: 6, borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)' }}>
            <IonGrid style={{ width: '100%', padding: 0 }}>
              <IonRow style={{ width: '100%' }}>

                {/* Image Column */}
                <IonCol size="3" style={{ padding: 0 }}>
                  <IonImg
                    style={{ width: '100%', height: 'auto' }}
                    src={`/images/item/item-${item.imgId}.webp`}
                    alt={`A ${item.name} with beautiful details`} />
                </IonCol>

                {/* Gold Column */}
                <IonCol size="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ color: getItemGradeColor(item?.grade ?? "common"), fontSize: '14px', marginBottom: 6 }}>
                    {item.name}
                  </div>
                  <div style={{ color: getItemGradeColor(item?.grade ?? "common"), fontSize: '14px', marginBottom: 6 }}>
                    Quantity: {item?.quantity}
                  </div>

                  {isForSale ? (<span>
                    Cost:<span style={{ color: 'gold' }}> {item.cost.toLocaleString()} G</span>
                  </span>
                  ) : (
                    <span>
                      Sale: <span style={{ color: 'gold' }}> {(item.cost).toLocaleString()} G</span>
                    </span>
                  )}
                </IonCol>

                <IonCol style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <IonButton fill="clear" id="sale-modal">Sale</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>




          {<ItemModal
            saleItem={saleItem}
            showModal={showModal}
            setShowModal={setShowModal}
            imgString={`/images/item/item-${item.imgId}.webp`}
            item={item} loading={false} />}
        </>
      ) : <IonSpinner />}

    </>
  );
};

export default GeneralItemCard;
