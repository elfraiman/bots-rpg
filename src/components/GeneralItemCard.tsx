import { IonButton, IonCol, IonGrid, IonImg, IonRow, IonSpinner, useIonToast } from "@ionic/react";
import { useContext, useState } from 'react';
import toast from "react-hot-toast";
import { PlayerContext } from '../context/PlayerContext';
import getItemGradeColor from "../functions/GetItemGradeColor";
import { getSellItem } from "../functions/GetSellItem";
import { IPlayerOwnedItem } from "../types/types";
import GeneralItemModal from "./GeneralItemModal";

interface IBootsCardProps {
  item: IPlayerOwnedItem;
  isForSell?: boolean;
}

const GeneralItemCard = ({ item, isForSell }: IBootsCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { player, updatePlayerData } = useContext(PlayerContext);
  const [loading, setLoading] = useState(false);

  if (item._id === undefined) {
    console.error("No id on item");
    return;
  }


  const sellItem = async (item: IPlayerOwnedItem, sellQuantity: number) => {
    if (player) {
      setLoading(true);
      await getSellItem(item, sellQuantity, updatePlayerData, player);
      toast(`Gold + ${sellQuantity * item.cost}`,
        {
          icon: '🪙',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      setShowModal(false);
      setLoading(false);
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
                    {loading ? <IonSpinner /> : (<>Quantity: {item?.quantity} </>)}
                  </div>

                  {isForSell ? (<span>
                    Cost:<span style={{ color: 'gold' }}> {item.cost.toLocaleString()} G</span>
                  </span>
                  ) : (
                    <span>
                      Sell: <span style={{ color: 'gold' }}> {(item.cost).toLocaleString()} G</span>
                    </span>
                  )}
                </IonCol>

                <IonCol style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <IonButton fill="clear" id="sell-modal">Sell</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>



          {<GeneralItemModal
            sellItem={sellItem}
            showModal={showModal}
            setShowModal={setShowModal}
            imgString={`/images/item/item-${item.imgId}.webp`}
            item={item} loading={loading} />}
        </>
      ) : <IonSpinner />}

    </>
  );
};

export default GeneralItemCard;
