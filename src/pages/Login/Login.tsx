import { IonAlert, IonButton, IonCard, IonCardContent, IonContent, IonInput, IonItem, IonLabel, IonPage } from "@ionic/react";
import { useContext, useState, FormEvent } from 'react'; // Import FormEvent
import * as Realm from 'realm-web';
import './Login.css';
import { PlayerContext } from "../../context/PlayerContext";
import { useHistory } from "react-router";

const app = Realm.App.getApp('application-0-vgvqx');

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const { setPlayer } = useContext(PlayerContext);
    const history = useHistory();
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        // Use local variables to get current input values directly from the form
        const form = e.target as HTMLFormElement;
        const email = form.email.value;
        const password = form.password.value;
        const verifyPassword = !isLogin ? form.verifyPassword.value : password; // Only use verifyPassword in registration mode


        if (!isLogin) {
            // Handle registration
            if (password !== verifyPassword) {
                setShowAlert(true);
                return;
            }
            try {
                await app.emailPasswordAuth.registerUser({ email, password });
                const user: Realm.User = await app.logIn(Realm.Credentials.emailPassword(email, password));

                if (user) {
                    history?.push('/shop')
                }
            } catch (error) {
                console.error("Error registering new user:", error);
            }
        } else {
            // Handle login
            try {
                const user: Realm.User = await app.logIn(Realm.Credentials.emailPassword(email, password));

                if (user) {
                    console.log('user')
                    history.push('/shop'); // Refresh or redirect upon successful login
                }
            } catch (error) {
                console.error("Error logging in:", error);
            }
        }
    };

    return (
        <IonPage>
            <IonContent className="ion-padding login-bg">
                <IonCard className="card-fade login-card">
                    <IonCardContent>
                        <form onSubmit={handleSubmit}> {/* Wrap inputs and buttons with a form */}
                            <IonItem>
                                <IonLabel position="floating">Email</IonLabel>
                                <IonInput value={email} onIonChange={e => setEmail(e.detail.value!)} type="email" name="email"></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Password</IonLabel>
                                <IonInput value={password} onIonChange={e => setPassword(e.detail.value!)} type="password" name="password"></IonInput>
                            </IonItem>

                            {!isLogin && (
                                <IonItem>
                                    <IonLabel position="floating">Verify Password</IonLabel>
                                    <IonInput value={verifyPassword} onIonChange={e => setVerifyPassword(e.detail.value!)} type="password" name="verifyPassword"></IonInput>
                                </IonItem>
                            )}

                            <IonButton type="submit" expand="block" style={{ marginTop: 26 }}>
                                {isLogin ? 'Login' : 'Register'}
                            </IonButton>
                        </form>

                        <div style={{ marginTop: 26 }}>
                            {isLogin ? (
                                <span onClick={() => setIsLogin(false)}>Don't have an account? <a>Register here</a></span>
                            ) : (
                                <span onClick={() => setIsLogin(true)}>Already have an account? <a>Sign in</a></span>
                            )}
                        </div>
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
