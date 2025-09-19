import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bunkmate.app',
  appName: 'BunkMate - Attendance Tracker',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#007AFF",
      showSpinner: false
    }
  }
};

export default config;