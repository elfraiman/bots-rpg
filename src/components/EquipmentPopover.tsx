import { IonCardSubtitle, IonCol, IonContent, IonImg, IonPopover, IonRow, IonText, IonThumbnail } from "@ionic/react";
import getItemGradeColor from "../functions/GetItemGradeColor";
import { IPlayerOwnedArmor, IPlayerOwnedWeapon } from "../types/types";

interface IEquipmentPopoverProps {
  equippedDetails: IPlayerOwnedWeapon | IPlayerOwnedArmor;
  trigger: string;
}


const EquipmentPopover = ({ equippedDetails, trigger }: IEquipmentPopoverProps) => {
  if (!equippedDetails) return;

  return (
    <>
      <IonPopover alignment='center' trigger={trigger} triggerAction="click">
        <IonContent>
          <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
            <IonCol size="8" className="ion-padding">
              <IonText>
                <span style={{ color: getItemGradeColor(equippedDetails?.grade ?? "common") }}>{equippedDetails?.name}</span>
              </IonText>
              <IonCardSubtitle>
                <span style={{ color: getItemGradeColor(equippedDetails?.grade ?? "common") }}>{equippedDetails?.grade}</span>
              </IonCardSubtitle>

              {equippedDetails.type === "weapon" ? (
                <IonText>
                  AP: {(equippedDetails as IPlayerOwnedWeapon)?.stats?.minAttack} ~ {(equippedDetails as IPlayerOwnedWeapon)?.stats?.maxAttack}
                </IonText>

              ) : (<IonText>
                DP: {(equippedDetails as IPlayerOwnedArmor)?.stats?.defense} <br />
                Evasion: {(equippedDetails as IPlayerOwnedArmor)?.stats?.evasion}
              </IonText>)}


            </IonCol>
            <IonCol size="4" style={{ padding: 0 }}>
              <div style={{ display: 'flex' }}>
                <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                  <IonImg style={{ objectFit: 'cover' }} alt={`A ${equippedDetails?.name} with beautiful details`} src={equippedDetails.type === "weapon" ? `/images/weapon/weapon-${equippedDetails?.imgId}.webp` : `/images/${equippedDetails.type}/${equippedDetails.type}-${equippedDetails?.imgId}.webp`} />
                </IonThumbnail>
              </div>
            </IonCol>
          </IonRow>
        </IonContent>
      </IonPopover>

    </>
  )
}


export default EquipmentPopover;