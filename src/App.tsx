import { IonApp, IonButton, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { diamondOutline, medalOutline, planetOutline, rocketOutline, trophyOutline, walkOutline } from 'ionicons/icons';
import React from 'react';
import { Redirect, Route, useHistory, useLocation } from 'react-router';
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
import { SplashScreen } from '@capacitor/splash-screen';
import { Toaster } from 'react-hot-toast';
import { useNavigationDisable } from './context/DisableNavigationContext';
import { usePlayerData } from './context/PlayerContext';
import BattleTrain from './pages/BattleTrain/BattleTrain';
import FightPvpPage from './pages/Fighting/FightPvpPage';
import GuardianPage from './pages/Guardian/GuardianPage';
import LeaderboardPage from './pages/Leaderboard/Leaderboard';
import Login from './pages/Login/Login';
import Shop from './pages/Shop/Shop';
import EnterEarthStoryPage from './pages/Story/EnterEarthStoryPage';
import InitialStoryPage from './pages/Story/InitialStoryPage';
import ExplorePage from './pages/Train/ExplorePage';
import GalaxyPage from './pages/Travel/GalaxyPage';
import './theme/variables.css';
import Header from './components/Header';
import { GlobalModalWrapper, GlobalModal } from 'react-global-modal'
import 'react-global-modal/dist/style.css';
import TraderIcon from '/images/icons/trader-icon.webp';
import GuardianIcon from '/images/icons/guardian-icon.webp';
import PvpIcon from '/images/icons/pvp-icon.webp'
import ShipIcon from '/images/icons/ship-icon.webp';
import TrophyIcon from '/images/icons/trophy-icon.webp';
import PlanetIcon from '/images/icons/planet-icon.webp';

setupIonicReact({
  rippleEffect: false,
  mode: 'md',
});

/* const initializeApp = async () => {
  const result = await LiveUpdates.sync();
  if (result.activeApplicationPathChanged) {
    await LiveUpdates.reload();
  }
  else {
    await SplashScreen.hide();
  }
}
 */

SplashScreen.hide()
const app = new Realm.App({ id: 'application-0-vgvqx' });
let globalModalRef: any = null

const App: React.FC = () => {
  // initializeApp();
  // Keep the logged in Realm user in local state. This lets the app re-render
  // whenever the current user changes (e.g. logs in or logs out).
  const [user, setUser] = React.useState<Realm.User | null>(app.currentUser);
  const { isNavigationDisabled } = useNavigationDisable(); // Use the custom hook
  const { player } = usePlayerData();

  React.useEffect(() => {
    if (app.currentUser) {
      setUser(app.currentUser)
    }
  }, [app.currentUser]);


  React.useEffect(() => {
    GlobalModal.setUpModal(globalModalRef)
  }, [])
  // If we have a user that doesn't have a nickname
  // we show the initial story page where he can set a nickname
  // if we have a user, show navigation
  // if we don't have a user, show login.
  //

  return (
    <IonApp>

      <IonReactRouter>
        <Toaster
          position="top-right"
          reverseOrder={true}
        />
        <GlobalModalWrapper ref={(el) => (globalModalRef = el)} />
        {user && player?.name === 'noname' ? (<InitialStoryPage />) : (
          <>
            {!user ? (<Login />) : (
              <>
                {player && player?.name !== "noname" ? (
                  <>
                    <Header />
                    <IonTabs>
                      <IonRouterOutlet>
                        <Redirect exact path="/" to="/guardian" />
                        <Route path="/guardian" render={() => <GuardianPage />} exact={true} />
                        <Route path="/planet" render={() => <ExplorePage />} exact={true} />
                        <Route path="/fight/:id" render={() => <BattleTrain />} exact={true} />
                        <Route path="/trader" render={() => <Shop />} exact={true} />
                        <Route path="/galaxy" render={() => <GalaxyPage />} exact={true} />
                        <Route path="/pvp" render={() => <FightPvpPage />} exact={true} />
                        <Route path="/leaderboard" render={() => <LeaderboardPage />} exact={true} />
                        <Route path="/login" render={() => <Login />} exact={true} />
                        <Route path="/initialstory" render={() => <InitialStoryPage />} exact={true} />
                        <Route path="/earthstory" render={() => <EnterEarthStoryPage />} exact={true} />
                      </IonRouterOutlet>


                      <IonTabBar slot="bottom" >
                        <IonTabButton disabled={isNavigationDisabled} tab="guardian" href="/guardian">
                          <img src={GuardianIcon} style={{ width: 35 }} />
                          <IonLabel>Quarters</IonLabel>
                        </IonTabButton>

                        <IonTabButton disabled={isNavigationDisabled} tab="planet" href="/planet">
                          <img src={PlanetIcon} style={{ width: 35 }} />
                          <IonLabel>Land</IonLabel>
                        </IonTabButton>

                        <IonTabButton disabled={isNavigationDisabled} tab="pvp" href="/pvp">
                          <img src={PvpIcon} style={{ width: 35 }} />
                          <IonLabel>PvP</IonLabel>
                        </IonTabButton>

                        <IonTabButton disabled={isNavigationDisabled || player?.level < 3} tab="trader" href="/trader">
                          <img src={TraderIcon} style={{ width: 35 }} />
                          <IonLabel>{player?.level < 3 ? 'Lv:3' : 'Trader'}</IonLabel>
                        </IonTabButton>

                        <IonTabButton disabled={isNavigationDisabled || player?.level < 5} tab="galaxy" href="/galaxy">
                          <img src={ShipIcon} style={{ width: 35 }} />
                          <IonLabel>{player?.level < 5 ? 'Lv:5' : 'Cockpit'}</IonLabel>
                        </IonTabButton>

                        <IonTabButton disabled={isNavigationDisabled} tab="leaderboard" href="/leaderboard">
                          <img src={TrophyIcon} style={{ width: 35 }} />
                          <IonLabel>Leaderboard</IonLabel>
                        </IonTabButton>

                      </IonTabBar>
                    </IonTabs>
                  </>
                ) : <></>}
              </>
            )}
          </>
        )}


      </IonReactRouter>
    </IonApp>
  )
};

export default App;
