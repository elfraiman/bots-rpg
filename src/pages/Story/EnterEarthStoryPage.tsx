

import { IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonImg, IonPage, IonText } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useNavigationDisable } from "../../context/DisableNavigationContext";
import useTypewriter from "../../hooks/UseTypewritter";
import './story.css';

const EnterEarthStoryPage = () => {
  const history = useHistory();
  const { setIsNavigationDisabled } = useNavigationDisable();
  const [pageExiting, setPageExiting] = useState(false);

  const Typewriter = ({ text, speed }: any) => {
    const displayText = useTypewriter(text, speed);

    return <p>{displayText}</p>;
  };

  useEffect(() => {
    setIsNavigationDisabled(true);
  }, [])

  const handleSkip = () => {
    // Trigger the fade-out animation
    setPageExiting(true);

    // Wait for the animation to complete before changing the route
    setTimeout(() => {
      history.replace(`/guardian`);
      setIsNavigationDisabled(false);
    }, 1000); // Adjust the timeout duration to match your CSS animation duration
  };

  return (
    <IonPage id="main-content" className={`content  ${pageExiting ? 'page-exit' : 'fade-in'}`}>
      <IonHeader>
        <IonButton color="warning" fill="clear" style={{
          width: '100%', marginTop: 8
        }}
          onClick={handleSkip}>Skip</IonButton>
      </IonHeader>
      <IonContent style={{
        '--background': `url('/images/planets/planet-ground-0.webp') 0 0/cover no-repeat `,
      }}>

        <IonCard className="corner-border card-fade fade-in" style={{ padding: 0 }}>
          <img alt={`Elara the scholar`} src={`/images/npc/npc-ship-2.webp`} />
          <IonCardHeader>
            <IonCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>Elara Thorne</IonCardTitle>
            <IonCardSubtitle>Scholar</IonCardSubtitle>
          </IonCardHeader>
          <div className="ion-padding">
            <span style={{ zIndex: 5, fontSize: 16, color: `var(--ion-color-warning)`, fontWeight: 600 }}>
              {Typewriter({
                text: `  The remnants of human civilization have transformed Earth into a barren wasteland, where the remaining cities are cobbled together from the relics of advanced technology. The survivors, banded together into various factions, use robots as their primary means of survival and defense. These robots, revered as Steel Sentinels, are not mere tools but partners, crafted and cared for by their human counterparts. `,
                speed: 20
              })}</span>
          </div>
        </IonCard>

      </IonContent>
    </IonPage>
  )
}

export default EnterEarthStoryPage;
