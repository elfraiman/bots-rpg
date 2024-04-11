import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '3fb6cd5f',
  appName: 'Mecha guardians',
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
      launchAutoHide: true
    }
  }
};

export default config;
