import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonModal, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
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

      updatePlayerData({ name: nickname });
      setShowModal(false); // Close the modal only if nickname is valid
      handleSkip();
    }
  };


  const handleSkip = () => {
    // Wait for the animation to complete before changing the route
    setTimeout(() => {
      history.replace(`/earthstory`);
    }, 1000); // Adjust the timeout duration to match your CSS animation duration
  };

  return (
    <IonPage className="fade-in">
      <IonHeader>
        <IonButton color="warning" fill="clear" style={{
          width: '100%'
        }} onClick={() => setShowModal(true)}>Skip</IonButton>
      </IonHeader>

      <IonContent style={{
        '--background': `url('/images/story/initialstory-bg.webp') 0 0/cover no-repeat `,
      }}>

        <IonCard className="corner-border card-fade fade-in" style={{ padding: 0 }}>
          <img alt={`Elara the scholar`} src={`/images/npc/story-npc-4.webp`} />
          <IonCardHeader>
            <IonCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>Elara Thorne</IonCardTitle>
            <IonCardSubtitle>Scholar</IonCardSubtitle>
          </IonCardHeader>
          <div className="ion-padding">
            <span style={{ zIndex: 5, fontSize: 16, color: `var(--ion-color-warning)`, fontWeight: 600 }}>{Typewriter({ text: `  In the year 2100, the remnants of humanity scavenge through the ruins of a once-prosperous civilization, now shattered by global catastrophes and wars over dwindling resources. This period, known as the "Scorched Epoch," marks humanity’s desperate search for a new home among the stars. Driven from Earth, survivors travel to distant, uncharted planets, each filled with its own dangers and dark secrets.`, speed: 20 })}</span>
          </div>
        </IonCard>
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