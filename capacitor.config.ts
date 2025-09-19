import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.179d0efb5af94f23b9558c4bd4de7888',
  appName: 'BunkMate - Attendance Tracker',
  webDir: 'dist',
  server: {
    url: 'https://179d0efb-5af9-4f23-b955-8c4bd4de7888.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#007AFF",
      showSpinner: false
    }
  }
};

export default config;