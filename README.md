# Nokia Calendar App

A minimalist, lightweight calendar app inspired by Nokia N72 and Nokia 5310, built with React and Capacitor for Android.

## Features

- 📅 **Simple Calendar View** - Month view with day navigation
- 🔔 **Notifications** - Create notifications with date, time, and message
- 🔁 **Repeat Options** - Once, Daily, Weekly, Monthly
- 📱 **System Integration** - Notifications work even when app is closed
- 🎨 **Light/Dark Mode** - Easy on the eyes with pastel colors
- 🔊 **Sound & Vibration** - Customizable notification alerts
- ⚡ **Lightweight** - Minimal CPU usage, smooth performance

## Prerequisites

- Node.js 16+ and npm
- Android Studio (for building APK)
- Java Development Kit (JDK) 11+
- Android SDK (API 21+)

## Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/ofekshulberg/nokia-calendar-app.git
cd nokia-calendar-app
npm install
```

### 2. Run in Browser (Development)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 3. Build for Android

```bash
# Build the web app
npm run build

# Add Android platform
npx cap add android

# Sync changes to Android
npx cap sync android

# Open Android Studio
npx cap open android
```

## Building the APK

### In Android Studio:

1. Wait for Gradle to sync
2. Go to **Build** → **Generate Signed Bundle / APK**
3. Select **APK**
4. Create or select a keystore
5. Fill in keystore details (remember your password!)
6. Select **release** build variant
7. Click **Finish**

The signed APK will be saved in: `android/app/release/app-release-signed.apk`

## Installing on Redmi 15

### Option 1: USB Cable

1. Connect Redmi 15 to computer via USB
2. Enable **USB Debugging** in Developer Options
3. Run: `adb install android/app/release/app-release-signed.apk`

### Option 2: Manual Installation

1. Transfer `app-release-signed.apk` to your Redmi 15 via:
   - USB cable + file manager
   - Google Drive
   - WhatsApp (send to yourself)

2. Open the file with your file manager

3. MIUI will ask: *"Allow installation from unknown sources?"*
   - Tap **Allow** (or go to Settings → Apps → Special access → Install unknown apps → enable for your file manager)

4. Tap **Install**

5. Green icon appears on home screen ✅

6. Tap to open - runs full screen, no browser bar

## App Usage

### Calendar Screen
- **←/→ arrows** - Navigate between months
- **Year button** - Pick a different year
- **⚙️ gear icon** - Settings (light/dark mode, sound, vibration)
- **Tap any date** - View/create notifications for that date

### Create Notification
1. Tap **+ New Notification**
2. Set **Date** and **Time**
3. Choose **Repeat** option (Once/Daily/Weekly/Monthly)
4. Write your **Message**
5. Tap **Done** - notification is saved and scheduled

### Edit Notification
1. Tap a notification on the date detail page
2. Modify date, time, message, or repeat
3. Tap **Done** to save or **Delete** to remove

## Settings

- **Theme** - Toggle between Light Mode (default) and Dark Mode
- **Vibration** - Enable/disable vibration on notifications
- **Notification Sound** - Choose from None, Default, Bell, Chime, Digital

## Technical Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Mobile**: Capacitor 6
- **State**: React Context API
- **Storage**: localStorage (persistent)
- **Notifications**: @capacitor/local-notifications

## File Structure

```
src/
├── pages/
│   ├── Calendar.tsx          # Main calendar page
│   └── DateDetail.tsx        # Date detail & notifications
├── components/
│   ├── CalendarGrid.tsx      # Calendar grid view
│   ├── MonthNavigation.tsx   # Month/year navigation
│   ├── YearPicker.tsx        # Year selection modal
│   ├── NotificationModal.tsx # Create/edit notifications
│   ├── NotificationCard.tsx  # Notification display
│   ├── SettingsButton.tsx    # Settings button
│   └── SettingsModal.tsx     # Settings panel
├── context/
│   ├── NotificationContext.tsx  # Notifications state
│   └── SettingsContext.tsx      # Settings state
├── styles/
│   ├── App.css
│   ├── Calendar.css
│   ├── CalendarGrid.css
│   ├── DateDetail.css
│   ├── MonthNavigation.css
│   ├── NotificationCard.css
│   ├── NotificationModal.css
│   ├── SettingsButton.css
│   ├── SettingsModal.css
│   ├── YearPicker.css
│   └── index.css
├── main.tsx           # React entry point
└── App.tsx           # Main App component
```

## Troubleshooting

### Notifications not firing
- Ensure permission is granted: Settings → Apps → Nokia Calendar → Notifications → Allow
- For Android 12+: Allow notifications from "Nokia Calendar" in Settings → Notifications

### APK won't install
- Check that "Install from unknown sources" is enabled for your file manager
- Ensure your device storage has at least 50MB free
- Try uninstalling previous version first

### App crashes on startup
- Clear app data: Settings → Apps → Nokia Calendar → Storage → Clear Data
- Reinstall the APK

### Notifications not persisting after reboot
- This is a known limitation of web-based notifications. Advanced users can configure a background service in Android Studio.

## Performance Notes

- **Minimal JS bundle** - ~150KB gzipped
- **CPU efficient** - Only wakes up for notifications
- **Battery friendly** - Uses system AlarmManager, not polling
- **Fast load time** - <1 second from tap to display

## License

MIT

## Support

For issues, questions, or feature requests:
https://github.com/ofekshulberg/nokia-calendar-app/issues
