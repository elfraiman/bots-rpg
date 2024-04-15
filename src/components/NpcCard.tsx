import { IonCard, IonRow, IonCol, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from "@ionic/react"


interface INpcCardProps {
  npcName: string;
  npcText: string;
  npcRole: string;
  npcImgId: number;
}

const NpcCard = ({ npcName, npcRole, npcText, npcImgId }: INpcCardProps) => {
  return (
    <IonCard style={{ padding: 0, margin: 0, height: 180, borderRadius: 0 }} className="corner-border" >
      <IonRow>
        <IonCol>
          <IonCardHeader>
            <IonCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>{npcName}</IonCardTitle>
            <IonCardSubtitle>{npcRole}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {npcText}
          </IonCardContent>
        </IonCol>

        <IonCol style={{ margin: 0, padding: 0 }}>
          <img alt={`Alex the shop attendant`} src={`/images/npc/npc-ship-${npcImgId}.webp`} style={{ margin: 0 }} />
        </IonCol>
      </IonRow>
    </IonCard>
  )
}


export default NpcCard;