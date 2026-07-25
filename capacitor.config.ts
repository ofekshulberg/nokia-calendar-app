import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nokiacalendar.app',
  appName: 'Nokia Calendar',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#d4a5a5',
      sound: 'default',
      vibrate: true,
    },
    'CapacitorCookies': {
      enabled: true,
    },
  },
};

export default config;
