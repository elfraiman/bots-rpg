import { IonCardSubtitle, IonCol, IonGrid, IonImg, IonRow } from "@ionic/react";
import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { getCreateBoots } from "../functions/GetCreateBoots";
import { getSaleBoots } from "../functions/GetSaleBoots";
import getItemGradeColor from "../functions/GetWeaponColor";
import { IBoots, IItem, IPlayer, IShopBoots } from "../types/types";
import ItemModal from "./ItemModal";
import './WeaponCard.css';
import { getSaleItem } from "../functions/GetSaleItem";

interface IBootsCardProps {
  item: IItem;
  initialPlayer: IPlayer;
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
                  <div style={{ color: getItemGradeColor(item.grade), fontSize: '14px', marginBottom: 6 }}>
                    {item.name}
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



          {/*       <ItemModal
                        equipItem={equipBoots}
                        isForSale={isForSale ?? false}
                        canPurchase={checkRequirements(isForSale ?? false)}
                        purchaseItem={purchaseBoots}
                        saleItem={saleBoots}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        imgString={`/images/boots/boots-${boots.imgId}.webp`}
                        item={boots} /> */}
        </>
      ) : <>Loading..</>}

    </>
  );
};

export default GeneralItemCard;
