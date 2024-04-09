

import { IonButton, IonContent, IonHeader, IonImg, IonPage, IonText } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useSplashScreen } from "../../context/SplashScreenContxt";
import useTypewriter from "../../hooks/UseTypewritter";
import './story.css';

const EnterEarthStoryPage = () => {
  const history = useHistory();
  const { setIsSplashScreenActive } = useSplashScreen();
  const [pageExiting, setPageExiting] = useState(false);

  const Typewriter = ({ text, speed }: any) => {
    const displayText = useTypewriter(text, speed);

    return <p>{displayText}</p>;
  };

  useEffect(() => {
    setIsSplashScreenActive(true);
  }, [])

  const handleSkip = () => {
    // Trigger the fade-out animation
    setPageExiting(true);

    // Wait for the animation to complete before changing the route
    setTimeout(() => {
      history.push(`/guardian`);
      setIsSplashScreenActive(false);
    }, 1000); // Adjust the timeout duration to match your CSS animation duration
  };

  return (
    <IonPage id="main-content" className={`content ${pageExiting ? 'page-exit' : ''}`}>
      <IonHeader>
        <IonButton color="warning" fill="clear" style={{
          width: '100%', marginTop: 8
        }}
          onClick={handleSkip}>Skip</IonButton>
      </IonHeader>
      <IonContent >
        <div className="story-screen">
          <IonImg src="/images/earthstory-bg.webp" style={{ position: 'absolute', zIndex: 1, height: '100vh' }} />
          {/* Overlay div */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
            zIndex: 1, // Ensure it sits above the background but below the content
            height: '100vh'
          }}></div>


          <IonText className="ion-padding" style={{ zIndex: 5, fontSize: 20, color: '#FFE81F', fontWeight: 600 }}>
            {Typewriter({
              text: `  Earth stands as a beacon of progress and unity in the cosmos. Humanity has transformed their home into a utopian world where nature and technology exist in harmony. The planet's surface is a testament to this balance: sprawling green cities merge seamlessly with restored forests, rivers, and oceans teeming with life.
Earth is the heart of the Galactic Expansion Era, serving as the capital for the United Earth Council and the birthplace of the Mecha Guardian Program. Its cities are centers of innovation and culture, drawing beings from across the galaxy to study, trade, and share knowledge.
From space, Earth is a jewel of blues, greens, and whites, with swirling clouds hinting at its dynamic weather systems. Its oceans glisten under the sun's light, reflecting the peace and harmony that humanity has achieved. Yet, this tranquility belies the turbulent past and the challenges faced in reaching this utopian state, reminding all of Earth's resilience and humanity's capacity for change.`,
              speed: 20
            })}
          </IonText>

        </div>
      </IonContent>
    </IonPage>
  )
}

export default EnterEarthStoryPage;
