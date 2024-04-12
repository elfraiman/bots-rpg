import { IonAlert, IonButton, IonCard, IonCardContent, IonCardTitle, IonContent, IonInput, IonItem, IonPage } from "@ionic/react";
import { FormEvent, useState } from 'react'; // Import FormEvent
import { useHistory } from "react-router";
import * as Realm from 'realm-web';
import { useNavigationDisable } from "../../context/DisableNavigationContext";
import SplashScreen from "../SplashScreen/SplashScreen";
import './Login.css';

const app = Realm.App.getApp('application-0-vgvqx');

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const history = useHistory();
    const [isLogin, setIsLogin] = useState(true);
    const { isNavigationDisabled, triggerDisableWithTimer } = useNavigationDisable();


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
                setAlertMessage("Passwords do not match");
                setShowAlert(true);
                return;
            }

            try {
                await app.emailPasswordAuth.registerUser({ email, password });
                await app.logIn(Realm.Credentials.emailPassword(email, password));
                history.replace('/initialstory');

                window.location.reload();
            } catch (error: any) {
                console.error("Error registering new user:", error);
                setAlertMessage(error.error)
                setShowAlert(true);
            }
        } else {
            // Handle login
            try {
                await app.logIn(Realm.Credentials.emailPassword(email, password));
                triggerDisableWithTimer(5000)
                setTimeout(() => {
                    history.replace('/guardian');

                    window.location.reload();
                }, 5000)


            } catch (error: any) {
                console.error("Error logging in:", error);
                setAlertMessage(error.error)
                setShowAlert(true);
            }
        }
    };

    return (
        <IonPage>
            {isNavigationDisabled ? (
                <SplashScreen />
            ) : (
                <>
                    <IonContent className="login-bg">
                        <IonCard className="card-fade login-card ion-padding">
                            <IonCardTitle>
                                Alpha {import.meta.env.VITE_REACT_APP_VERSION}
                            </IonCardTitle>
                            <IonCardContent>

                                <form onSubmit={(e) => handleSubmit(e)}> {/* Wrap inputs and buttons with a form */}
                                    <IonItem>
                                        <IonInput required={true} label="Email" value={email} onIonChange={e => setEmail(e.detail.value!)} type="email" name="email"></IonInput>
                                    </IonItem>
                                    <IonItem>
                                        <IonInput required={true} label="Password" value={password} onIonChange={e => setPassword(e.detail.value!)} type="password" name="password"></IonInput>
                                    </IonItem>

                                    {!isLogin && (
                                        <IonItem>
                                            <IonInput label="Verify password" value={verifyPassword} onIonChange={e => setVerifyPassword(e.detail.value!)} type="password" name="verifyPassword"></IonInput>
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
                            message={alertMessage}
                            buttons={['OK']}
                        />
                    </IonContent>
                </>
            )}

        </IonPage>
    );
}

export default LoginPage;
