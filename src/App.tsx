import { IonApp, IonButton, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';
import { Redirect, Route } from 'react-router';
import * as Realm from "realm-web";

import { barbell, diamond, home, medal, search } from 'ionicons/icons';


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
import Shop from './pages/Shop/Shop';
import Train from './pages/Train/TrainingRoom';
import './theme/variables.css';


setupIonicReact();

// Create a component that displays the given user's details
const UserDetail = ({ user }: { user: Realm.User }) => {
  return (
    <div>
      <h1>Logged in with anonymous id: {user.id}</h1>
    </div>
  );
};

// Create a component that lets an anonymous user log in
type LoginProps = {
  setUser: (user: Realm.User) => void;
};


const Login = ({ setUser }: LoginProps) => {
  const loginAnonymous = async () => {
    const user: Realm.User = await app.logIn(Realm.Credentials.anonymous());
    setUser(user);
  };


  return <IonButton onClick={loginAnonymous}>Log In</IonButton>;
};
// Add your App ID
const app = new Realm.App({ id: 'application-0-vgvqx' });

const App: React.FC = () => {
  // Keep the logged in Realm user in local state. This lets the app re-render
  // whenever the current user changes (e.g. logs in or logs out).
  const [user, setUser] = React.useState<Realm.User | null>(app.currentUser);



  return (
    <PlayerProvider>
      <IonApp>
        {user ? (
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Redirect exact path="/" to="/home" />
                {/*
                  Use the render method to reduce the number of renders your component will have due to a route change.
        
                  Use the component prop when your component depends on the RouterComponentProps passed in automatically.
                */}
                <Route path="/home" render={() => <Home />} exact={true} />
                <Route path="/train" render={() => <Train />} exact={true} />
                <Route path="/train/:id" render={() => <BattleTrain />} exact={true} />
                <Route path="/shop" render={() => <Shop />} exact={true} />
                <Route path="/search" render={() => <Home />} exact={true} />
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
                <IonTabButton tab="search" href="/search">
                  <IonIcon icon={search} />
                  <IonLabel>Search</IonLabel>
                </IonTabButton>
                <IonTabButton tab="search" href="/search">
                  <IonIcon icon={search} />
                  <IonLabel>Search</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        ) : <Login setUser={setUser} />}

      </IonApp>
    </PlayerProvider>
  )
};

export default App;
