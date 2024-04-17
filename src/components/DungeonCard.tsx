import { IonButton, IonCardSubtitle, IonCol, IonRow } from "@ionic/react";
import { useHistory } from "react-router";
import { IDungeon } from "../types/types";



const DungeonCard = ({ dungeon }: { dungeon: IDungeon }) => {
  const history = useHistory();

  return (
    <IonRow>
      <IonCol size="6">
        {dungeon?.name}
        <IonCardSubtitle>{dungeon?.description}</IonCardSubtitle>
      </IonCol>
      <IonCol style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <IonButton fill="clear" className="corner-border"
          onClick={(e) => {
            e.preventDefault();
            history.push(`/dungeon/${dungeon._id}`);
          }}
        >Enter</IonButton>
      </IonCol>
    </IonRow>
  )
}

export default DungeonCard;