import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import './Home.css';
import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import BotOutline from '../../resources/images/BotOutline.webp';


const styles = {
  notEquipped: { backgroundColor: 'rgba(214, 214, 214, 0.467)', border: '1px solid white' },
  equipped: { backgroundColor: 'rgba(0, 255, 30, 0.23)', border: '1px solid greenyellow' }
}

const Home: React.FC = () => {
  const { player } = useContext(PlayerContext);

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">Side menu</IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding home-bg">
          {player ? (
            <IonCard className="ion-padding card-fade ion-bot-card">
              <IonCardTitle>{player.name}</IonCardTitle>
              <IonCardSubtitle>Level: {player.level}</IonCardSubtitle>
              <IonCardContent className="bot-card-content">
                <IonImg src={BotOutline} className="bot-outline-img" />
                <div className="left-arm-block" style={player.equipment?.mainHand ? styles.equipped : styles.notEquipped}>
                </div>
                <div className="right-arm-block" style={player.equipment?.mainHand ? styles.equipped : styles.notEquipped}>
                </div>
                <div className="armor-block" style={styles.notEquipped}>
                </div>
                <div className="helmet-block" style={styles.notEquipped}>
                </div>
                <div className="right-boot-block" style={styles.notEquipped}>

                </div>
                <div className="left-boot-block" style={styles.notEquipped}>

                </div>
              </IonCardContent>
            </IonCard>
          ) : <>Loading...</>}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
