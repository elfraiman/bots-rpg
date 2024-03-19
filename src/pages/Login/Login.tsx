import { IonAlert, IonButton, IonCard, IonCardContent, IonContent, IonInput, IonItem, IonLabel, IonPage } from "@ionic/react";
import { useContext, useState } from 'react';
import * as Realm from 'realm-web';
import './Login.css';
import { PlayerContext } from "../../context/PlayerContext";
import { useHistory } from "react-router";

export interface LoginProps {
    setUser: (user: Realm.User) => void;
};

const app = Realm.App.getApp('application-0-vgvqx');

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const {setPlayer} = useContext(PlayerContext);
    const history = useHistory();

    const handleRegister = async () => {
        if (password !== verifyPassword) {
            setShowAlert(true);
            return;
        }
        try {
            await app.emailPasswordAuth.registerUser({ email, password });
           const user: Realm.User = await app.logIn(Realm.Credentials.emailPassword(email, password));

           if (user) {
                history?.go(0)
           }
        } catch (error) {
            console.error("Error registering new user:", error);
            // Handle registration errors here, e.g., email already in use.
        }
    };

    return (
        <IonPage>
            <IonContent className="ion-padding login-bg">

                <IonCard className="card-fade login-card">
                    <IonCardContent>
                        <IonItem>
                            <IonLabel position="floating">Email</IonLabel>
                            <IonInput value={email} onIonChange={e => setEmail(e.detail.value!)} type="email"></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Password</IonLabel>
                            <IonInput value={password} onIonChange={e => setPassword(e.detail.value!)} type="password"></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Verify Password</IonLabel>
                            <IonInput value={verifyPassword} onIonChange={e => setVerifyPassword(e.detail.value!)} type="password"></IonInput>
                        </IonItem>
                        <IonButton expand="block" onClick={handleRegister} className="register-btn">Register</IonButton>
                    </IonCardContent>
                </IonCard>


                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={'Error'}
                    message={'Passwords do not match'}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
}

export default LoginPage;
