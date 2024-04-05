import { IonCol, IonGrid, IonImg, IonRow } from "@ionic/react";
import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import GetItemGradeColor from "../functions/GetItemGradeColor";
import { getSaleItem } from "../functions/GetSaleItem";
import { IItem, IPlayerOwnedItem } from "../types/types";

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


  const saleItem = async (item: IItem) => {
    if (player) {
      await getSaleItem(item, player, updatePlayerData);
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
                    src={`/images/trash/trash-${item.imgId}.png`}
                    alt={`A ${item.name} with beautiful details`} />
                </IonCol>

                {/* Gold Column */}
                <IonCol size="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ color: GetItemGradeColor(item?.grade ?? "common"), fontSize: '14px', marginBottom: 6 }}>
                    {item.name}
                  </div>
                  <div style={{ color: GetItemGradeColor(item?.grade ?? "common"), fontSize: '14px', marginBottom: 6 }}>
                    Quantity: {item?.quantity}
                  </div>


                  {isForSale ? (<span>
                    Cost:<span style={{ color: 'gold' }}> {item.cost.toLocaleString()} G</span>
                  </span>
                  ) : (
                    <span>
                      Sale: <span style={{ color: 'gold' }}> {(item.cost / 2).toLocaleString()} G</span>
                    </span>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>


          {/* 
          {<EquipmentModal
            isForSale={isForSale ?? false}
            canPurchase={checkRequirements(isForSale ?? false)}
            purchaseItem={purchaseBoots}
            saleItem={saleBoots}
            showModal={showModal}
            setShowModal={setShowModal}
            imgString={`/images/boots/boots-${boots.imgId}.webp`}
            item={boots} />} */}
        </>
      ) : <>Loading..</>}

    </>
  );
};

export default GeneralItemCard;
