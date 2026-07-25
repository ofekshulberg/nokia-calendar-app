# Build Configuration

## Web Build

Builds to `dist/` directory:
```bash
npm run build
```

## Android Build Requirements

### Environment Setup

1. **Android Studio** - Download from https://developer.android.com/studio
2. **JDK 11 or later** - Required for Android development
3. **Android SDK** - Installed via Android Studio (API 21+)
4. **Gradle** - Bundled with Android Studio

### Build Steps

```bash
# 1. Install dependencies
npm install

# 2. Build web assets
npm run build

# 3. Add Android platform to Capacitor
npx cap add android

# 4. Sync web assets to Android project
npx cap sync android

# 5. Open Android Studio
npx cap open android
```

### In Android Studio

1. Wait for Gradle sync to complete (check bottom status bar)
2. Select **Build** menu
3. Choose **Generate Signed Bundle / APK**
4. Select **APK** option
5. Create a keystore or select existing:
   - **Key store path**: `/path/to/key.jks` (save this!)
   - **Key store password**: Choose a strong password
   - **Key alias**: `android-key`
   - **Key password**: Same as keystore
   - **Validity**: 25+ years
6. Select **release** build variant
7. Click **Finish**

APK location: `nokia-calendar-app/android/app/release/app-release-signed.apk`

## Signing Keys

⚠️ **Important**: Keep your keystore file and password safe!

You'll need the same keystore to update the app in the future.

## Troubleshooting

### "Gradle sync failed"
- File → Invalidate Caches → Invalidate and Restart
- Ensure Java path is correct: File → Project Structure → SDK Location

### "aapt: error: file not found"
- Run: `npx cap sync android`
- Rebuild: **Build** → **Clean Project**

### "compileSdkVersion is not specified"
- Already configured in `android/app/build.gradle`
- If error persists, update Android SDK: **Tools** → **SDK Manager**
