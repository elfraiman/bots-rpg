import { IonButton, IonContent, IonHeader, IonImg, IonPage } from "@ionic/react";
import useTypewriter from "../../hooks/UseTypewritter";
import { useHistory } from "react-router";



const EnterEarthStoryPage = () => {
  const history = useHistory();

  const Typewriter = ({ text, speed }: any) => {
    const displayText = useTypewriter(text, speed);

    return <p>{displayText}</p>;
  };


  return (
    <IonPage id="main-content" className="content">
      <IonHeader>
        <IonButton color="warning" fill="clear" style={{
          width: '100%', marginTop: 8
        }}
          onClick={(e) => {
            e.preventDefault();
            history.push(`/guardian`);
          }}>Skip</IonButton>
      </IonHeader>
      <IonContent >
        <div className="splash-screen">
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

          <div className="ion-padding" style={{ zIndex: 5, overflow: 'scroll' }}>
            <p style={{ fontSize: 20, color: '#FFE81F', fontWeight: 600 }}>
              {Typewriter({
                text: `  Earth stands as a beacon of progress and unity in the cosmos. Having overcome the environmental challenges of the past centuries, humanity has transformed their home into a utopian world where nature and technology exist in harmony. The planet's surface is a testament to this balance: sprawling green cities merge seamlessly with restored forests, rivers, and oceans teeming with life. The atmosphere is clean, with a clear blue sky free from the pollution that once choked it.
Earth is the heart of the Galactic Expansion Era, serving as the capital for the United Earth Council and the birthplace of the Mecha Guardian Program. Its cities are centers of innovation and culture, drawing beings from across the galaxy to study, trade, and share knowledge. Despite its advancements, Earth retains its natural beauty, with vast protected areas dedicated to preserving its diverse ecosystems.
From space, Earth is a jewel of blues, greens, and whites, with swirling clouds hinting at its dynamic weather systems. Its oceans glisten under the sun's light, reflecting the peace and harmony that humanity has achieved. Yet, this tranquility belies the turbulent past and the challenges faced in reaching this utopian state, reminding all of Earth's resilience and humanity's capacity for change.`,
                speed: 20
              })}
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}


export default EnterEarthStoryPage;