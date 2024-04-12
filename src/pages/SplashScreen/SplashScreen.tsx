import { IonContent } from "@ionic/react";
import "./SplashScreen.css"; // Ensure you create this CSS file in your project


const SplashScreen = () => {
    return (
        <IonContent>
            <div className="splash-screen">
                <div className='bg-video'>
                    <video playsInline autoPlay muted preload="auto" loop className="video" style={{ width: '100%' }} src={`/videos/travel-animation.mp4`}> </video>
                </div>
            </div>
        </IonContent>
    );
}

export default SplashScreen;
