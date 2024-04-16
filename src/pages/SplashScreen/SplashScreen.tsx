import { IonContent, IonImg } from "@ionic/react";
import "./SplashScreen.css"; // Ensure you create this CSS file in your project


const SplashScreen = (imgSrc?: any) => {
    return (
        <IonContent>
            <div className="splash-screen">
                <IonImg src={imgSrc.imgSrc ?? "/images/travel.webp"} />
                {/*      <video playsInline autoPlay muted preload="auto" loop className="video" style={{ width: '100%' }} src={`/videos/travel-animation.mp4`}> </video> */}
            </div>
        </IonContent>
    );
}

export default SplashScreen;
