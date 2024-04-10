import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Bots RPG',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LiveUpdates: {
      appId: '3fb6cd5f',
      channel: 'production',
      autoUpdateMethod: 'none',
      maxVersions: 2
    },
    SplashScreen: {
      launchAutoHide: false
    }
  }
};

export default config;
