import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.akrdev.rms.captain',
  appName: 'AKRDev Captain',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0f172a',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0f172a',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0f172a',
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0f172a',
  },
}

export default config
