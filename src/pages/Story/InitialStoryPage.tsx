import { IonButton, IonContent, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonModal, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { usePlayerData } from "../../context/PlayerContext";
import { useNavigationDisable } from "../../context/DisableNavigationContext";
import { checkNameIsValid } from "../../functions/GetPlayers";
import useTypewriter from "../../hooks/UseTypewritter";
import './story.css';


const InitialStoryPage = () => {
  const history = useHistory();
  const { player, updatePlayerData } = usePlayerData();
  const { setIsNavigationDisabled } = useNavigationDisable();
  const [pageExiting, setPageExiting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false); // State to track if nickname is valid

  const Typewriter = ({ text, speed }: any) => {
    const displayText = useTypewriter(text, speed);

    return <p>{displayText}</p>;
  };

  useEffect(() => {
    setIsNavigationDisabled(true);

    return () => setIsNavigationDisabled(false);
  }, [])

  const handleInputChange = (e: CustomEvent) => {
    const value = e.detail.value!;
    setNickname(value);
    setIsNicknameValid(value.trim().length >= 5 && value.trim().length <= 12);
  };

  const handleNicknameSubmit = async () => {
    if (isNicknameValid) {
      const checkName = await checkNameIsValid(nickname);

      if (checkName) {
        alert('Name taken');
        return;
      }

      updatePlayerData({ ...player, name: nickname });
      setShowModal(false); // Close the modal only if nickname is valid
      handleSkip();
    }
  };


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
          }} onClick={() => setShowModal(true)}>Skip</IonButton>
        </IonHeader>

        <div className="story-screen">
          <IonImg src="/images/initialstory-bg.webp" style={{ position: 'absolute', zIndex: -1, height: '100vh' }} />
          {/* Overlay div */}
          <div style={{
            position: 'absolute',
            top: 0,
            height: '100vh',
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


      <IonModal isOpen={showModal} backdropDismiss={false} className="ion-padding"> {/* Prevent modal from being dismissed by clicking outside */}
        <IonHeader >
          <IonToolbar>
            <IonTitle>Choose Nickname</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
          <IonItem>
            <IonLabel position="floating">Nickname</IonLabel>
            <IonInput value={nickname} onIonInput={handleInputChange} minlength={5} maxlength={12} required={true}></IonInput>
          </IonItem>
          <IonButton expand="block" fill="outline" style={{ marginTop: 26 }} onClick={handleNicknameSubmit} disabled={!isNicknameValid}>
            Confirm
          </IonButton>
        </div>
      </IonModal>

    </IonPage>
  )
}


export default InitialStoryPage;