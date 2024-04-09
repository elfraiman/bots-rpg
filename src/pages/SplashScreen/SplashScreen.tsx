import { IonContent, IonImg } from "@ionic/react";
import "./SplashScreen.css"; // Ensure you create this CSS file in your project
    

const SplashScreen = () => {
    return (
        <IonContent>
            <div className="splash-screen">
                <IonImg src="/images/travel.webp" />
            </div>
        </IonContent>
    );
}

export default SplashScreen;
