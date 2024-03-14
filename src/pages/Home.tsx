import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import { useState } from 'react';
import { Message, getMessages } from '../data/messages';
import './Home.css';

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useIonViewWillEnter(() => {
    const msgs = getMessages();
    setMessages(msgs);
  });


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
          <IonContent className="ion-padding">
            <IonText>
              <div>
                <p>Welcome to <strong>#NAME</strong></p>
                <p>Hello there and welcome to bots4! It looks like you are new, so here are some tips:</p>
                <ul>
                  <li>Train against Infant and collect some kudos.</li>
                  <li>Use the kudos in the showroom to buy weapons.</li>
                  <li>Train against Trainmate until you gain enough experience points to reach level 2.</li>
                  <li>Add stat points in the workshop when you level up. This is (roughly) what they do:</li>
                  <ul>
                    <li><strong>Strength</strong> - More damage.</li>
                    <li><strong>Dexterity</strong> - More accuracy.</li>
                    <li><strong>Constitution</strong> - More HP.</li>
                    <li><strong>Intelligence</strong> - More experience/kudos.</li>
                  </ul>
                </ul>
                <p>Have fun! There's no "right" way to play, so play however you want. :)</p>
              </div>
            </IonText>

          </IonContent>
        </IonPage>
      </>
  );
};

export default Home;
