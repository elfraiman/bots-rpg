import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { diamondOutline, medalOutline, planetOutline, rocketOutline, trophyOutline, walkOutline } from 'ionicons/icons';
import React from 'react';
import { Redirect, Route, useHistory } from 'react-router';
import * as Realm from "realm-web";


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import { useSplashScreen } from './context/SplashScreenContxt';
import BattleTrain from './pages/BattleTrain/BattleTrain';
import GuardianPage from './pages/Guardian/GuardianPage';
import LeaderboardPage from './pages/Leaderboard/Leaderboard';
import Login from './pages/Login/Login';
import Shop from './pages/Shop/Shop';
import ExplorePage from './pages/Train/ExplorePage';
import GalaxyPage from './pages/Travel/GalaxyPage';
import './theme/variables.css';
import InitialStoryPage from './pages/Story/InitialStoryPage';
import EnterEarthStoryPage from './pages/Story/EnterEarthStoryPage';
import FightPvpPage from './pages/Fighting/FightPvpPage';

setupIonicReact({
  rippleEffect: false,
  mode: 'md',
});

// Add your App ID
const app = new Realm.App({ id: 'application-0-vgvqx' });

const App: React.FC = () => {
  // Keep the logged in Realm user in local state. This lets the app re-render
  // whenever the current user changes (e.g. logs in or logs out).
  const [user, setUser] = React.useState<Realm.User | null>(app.currentUser);
  const { isSplashScreenActive } = useSplashScreen(); // Use the custom hook

  React.useEffect(() => {
    setUser(app.currentUser)
  }, [app.currentUser]);



  return (
    <IonApp>
      <IonReactRouter>
        {user ? (
          <IonTabs>
            <IonRouterOutlet>
              <Redirect exact path="/" to="/guardian" />
              <Route path="/guardian" render={() => <GuardianPage />} exact={true} />
              <Route path="/explore" render={() => <ExplorePage />} exact={true} />
              <Route path="/fight/:id" render={() => <BattleTrain />} exact={true} />
              <Route path="/shop" render={() => <Shop />} exact={true} />
              <Route path="/travel" render={() => <GalaxyPage />} exact={true} />
              <Route path="/pvp" render={() => <FightPvpPage />} exact={true} />
              <Route path="/leaderboard" render={() => <LeaderboardPage />} exact={true} />
              <Route path="/login" render={() => <Login />} exact={true} />
              <Route path="/initialstory" render={() => <InitialStoryPage />} exact={true} />
              <Route path="/earthstory" render={() => <EnterEarthStoryPage />} exact={true} />
            </IonRouterOutlet>


            <IonTabBar slot="bottom">
              <IonTabButton disabled={isSplashScreenActive} tab="home" href="/guardian">
                <IonIcon icon={walkOutline} />
                <IonLabel>Guardian</IonLabel>
              </IonTabButton>

              <IonTabButton disabled={isSplashScreenActive} tab="radio" href="/explore">
                <IonIcon icon={planetOutline} />
                <IonLabel>Explore</IonLabel>
              </IonTabButton>

              <IonTabButton disabled={isSplashScreenActive} tab="library" href="/pvp">
                <IonIcon icon={medalOutline} />
                <IonLabel>Fight</IonLabel>
              </IonTabButton>

              <IonTabButton disabled={isSplashScreenActive} tab="shop" href="/shop">
                <IonIcon icon={diamondOutline} />
                <IonLabel>Shop</IonLabel>
              </IonTabButton>

              <IonTabButton disabled={isSplashScreenActive} tab="travel" href="/travel">
                <IonIcon icon={rocketOutline} />
                <IonLabel>Travel</IonLabel>
              </IonTabButton>

              <IonTabButton disabled={isSplashScreenActive} tab="leaderboard" href="/leaderboard">
                <IonIcon icon={trophyOutline} />
                <IonLabel>Leaderboard</IonLabel>
              </IonTabButton>

            </IonTabBar>
          </IonTabs>
        ) : <Login />}
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
