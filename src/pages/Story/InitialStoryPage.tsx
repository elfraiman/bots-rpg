import { IonButton, IonContent, IonHeader, IonImg, IonPage, IonText } from "@ionic/react";
import useTypewriter from "../../hooks/UseTypewritter";
import { useHistory } from "react-router";



const InitialStoryPage = () => {
  const history = useHistory();

  const Typewriter = ({ text, speed }: any) => {
    const displayText = useTypewriter(text, speed);

    return <p>{displayText}</p>;
  };


  return (
    <IonPage>
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
        <div className="splash-screen">

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

          <IonText className="ion-padding" style={{ zIndex: 5 }}>
            <p style={{ fontSize: 20, color: '#FFE81F', fontWeight: 600 }}> {Typewriter({ text: `  In the year 2145, humanity has leapt into the stars, making the dream of interstellar travel a reality. This new era, dubbed the 'Galactic Expansion Era,' saw humans establishing colonies on distant planets and discovering resources beyond their wildest imaginations. However, this golden age of exploration brought forth unforeseen dangers: monstrous entities dwelling on newly discovered worlds, each harboring a deep-seated animosity towards humans and their technological marvels.`, speed: 20 })} </p>
          </IonText>
        </div>


      </IonContent>
    </IonPage>
  )
}


export default InitialStoryPage;