import { IonButton, IonContent, IonHeader, IonImg, IonPage, IonText } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useSplashScreen } from "../../context/SplashScreenContxt";
import useTypewriter from "../../hooks/UseTypewritter";



const InitialStoryPage = () => {
  const history = useHistory();
  const { setIsSplashScreenActive } = useSplashScreen();
  const [pageExiting, setPageExiting] = useState(false);

  const Typewriter = ({ text, speed }: any) => {
    const displayText = useTypewriter(text, speed);

    return <p>{displayText}</p>;
  };

  useEffect(() => {
    setIsSplashScreenActive(true);

    return () => setIsSplashScreenActive(false);
  }, [])

  const handleSkip = () => {
    // Trigger the fade-out animation
    setPageExiting(true);

    // Wait for the animation to complete before changing the route
    setTimeout(() => {
      history.push(`/earthstory`);
    }, 1000); // Adjust the timeout duration to match your CSS animation duration
  };

  return (
    <IonPage id="main-content" className={`content ${pageExiting ? 'page-exit' : ''}`}>
      <IonContent>
        <IonHeader>
          <IonButton color="warning" fill="clear" style={{
            width: '100%', marginTop: 8
          }}
            onClick={(e) => {
              e.preventDefault();
              history.push(`/earthstory`);
            }}>Skip</IonButton>
        </IonHeader>

        <div className="story-screen">
          <IonImg src="/images/initialstory-bg.webp" style={{ position: 'absolute', zIndex: -1, height: '100vh' }} />
          {/* Overlay div */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the opacity as needed
            zIndex: 1 // Ensure it sits above the background but below the content
          }}></div>

          <IonText className="ion-padding" style={{ zIndex: 5, fontSize: 20, color: '#FFE81F', fontWeight: 600 }}>
            {Typewriter({ text: `  In the year 2145, humanity has leapt into the stars, making the dream of interstellar travel a reality. This new era, dubbed the 'Galactic Expansion Era,' saw humans establishing colonies on distant planets and discovering resources beyond their wildest imaginations. However, this golden age of exploration brought forth unforeseen dangers: monstrous entities dwelling on newly discovered worlds, each harboring a deep-seated animosity towards humans and their technological marvels.`, speed: 20 })}
          </IonText>
        </div>


      </IonContent>
    </IonPage>
  )
}


export default InitialStoryPage;