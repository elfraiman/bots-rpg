import { IonApp, IonCard, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';
import { Redirect, Route } from 'react-router';
import * as Realm from "realm-web";

import { barbell, diamond, home, medal, planetOutline, search } from 'ionicons/icons';


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
import { PlayerProvider } from './context/PlayerContext';
import BattleTrain from './pages/BattleTrain/BattleTrain';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Shop from './pages/Shop/Shop';
import Train from './pages/Train/TrainingRoom';
import './theme/variables.css';
import GalaxyPage from './pages/Travel/GalaxyPage';


setupIonicReact();



// Add your App ID
const app = new Realm.App({ id: 'application-0-vgvqx' });

const App: React.FC = () => {
  // Keep the logged in Realm user in local state. This lets the app re-render
  // whenever the current user changes (e.g. logs in or logs out).
  const [user, setUser] = React.useState<Realm.User | null>(app.currentUser);



  return (
    <PlayerProvider>
      <IonApp>
        <IonReactRouter>
          {user ? (

            <IonTabs>
              <IonRouterOutlet>
                <Redirect exact path="/" to="/home" />
                <Route path="/home" render={() => <Home />} exact={true} />
                <Route path="/train" render={() => <Train />} exact={true} />
                <Route path="/train/:id" render={() => <BattleTrain />} exact={true} />
                <Route path="/shop" render={() => <Shop />} exact={true} />
                <Route path="/travel" render={() => <GalaxyPage />} exact={true} />
                <Route path="/search" render={() => <Home />} exact={true} />
                <Route path="/search" render={() => <Home />} exact={true} />
                <Route path="/search" render={() => <Home />} exact={true} />
              </IonRouterOutlet>


              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/home">
                  <IonIcon icon={home} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>

                <IonTabButton tab="radio" href="/train">
                  <IonIcon icon={barbell} />
                  <IonLabel>Train</IonLabel>
                </IonTabButton>

                <IonTabButton tab="library" href="/library">
                  <IonIcon icon={medal} />
                  <IonLabel>Fight</IonLabel>
                </IonTabButton>

                <IonTabButton tab="shop" href="/shop">
                  <IonIcon icon={diamond} />
                  <IonLabel>Shop</IonLabel>
                </IonTabButton>
                <IonTabButton tab="travel" href="/travel">
                  <IonIcon icon={planetOutline} />
                  <IonLabel>Galaxy</IonLabel>
                </IonTabButton>
                <IonTabButton tab="search" href="/search">
                  <IonIcon icon={search} />
                  <IonLabel>Search</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>


          ) : <Login />}
        </IonReactRouter>
      </IonApp>
    </PlayerProvider>
  )
};

export default App;
