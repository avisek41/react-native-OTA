# 🐴 Stallion OTA Setup - Next Steps Guide

## ✅ Setup Complete!

Your Stallion OTA setup is complete. Here's what to do next:

---

## 📱 Step 1: Test Your App

### Run the App

**Android:**
```bash
npm run android
# or
yarn android
```

**iOS:**
```bash
# First time: Install CocoaPods dependencies
bundle exec pod install

# Then run
npm run ios
# or
yarn ios
```

### Verify Stallion is Working

1. **Check Console Logs**: Look for Stallion initialization messages
2. **Check Network**: Stallion should sync with the server on app start
3. **No Errors**: Ensure no Stallion-related errors appear

---

## 🚀 Step 2: Install Stallion CLI

Install the Stallion CLI globally to publish OTA updates:

```bash
npm install -g @stallion/cli
# or
yarn global add @stallion/cli
```

### Login to Stallion

```bash
stallion login
```

This will prompt you to authenticate with your Stallion account.

---

## 📦 Step 3: Create Your First OTA Update

### 3.1 Make a Code Change

Edit `App.tsx` to make a visible change (e.g., change the welcome text):

```tsx
// In App.tsx, change line 20:
<Text style={styles.title} testID="app-title">Welcome Updated!</Text>
```

### 3.2 Build the JavaScript Bundle

**For Android:**
```bash
# Build the bundle
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res/
```

**For iOS:**
```bash
# Build the bundle
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios/
```

### 3.3 Publish to Stallion

```bash
# Publish the bundle
stallion publish \
  --project-id 6979abc9398fbe18cdf25772 \
  --bundle-path android/app/src/main/assets/index.android.bundle \
  --platform android
```

**For iOS:**
```bash
stallion publish \
  --project-id 6979abc9398fbe18cdf25772 \
  --bundle-path ios/main.jsbundle \
  --platform ios
```

---

## 🧪 Step 4: Test the OTA Update

1. **Keep the app running** (or restart it)
2. **Wait for sync**: The app will automatically check for updates
3. **See the update banner**: You should see the green "🎉 New update available!" banner
4. **Restart the app**: The Stallion modal will appear, prompting you to restart
5. **Verify the change**: After restart, you should see your updated text

---

## 📊 Step 5: Monitor Updates in Stallion Console

1. Visit: https://console.stalliontech.io/
2. Login with your account
3. Navigate to your project: `6979abc9398fbe18cdf25772`
4. View:
   - Published bundles
   - Update adoption rates
   - Device analytics
   - Rollback options

---

## 🔧 Step 6: Production Deployment

### Build Release APK (Already Done!)

Your release APK is already built at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Deploy to Production

1. **Upload APK to Play Store** (or distribute internally)
2. **Publish OTA updates** using Stallion CLI whenever you need to update JavaScript
3. **No app store approval needed** for JavaScript updates!

---

## 🎯 Common Commands

### Check Stallion Status
```bash
stallion status --project-id 6979abc9398fbe18cdf25772
```

### List Published Bundles
```bash
stallion list --project-id 6979abc9398fbe18cdf25772
```

### Rollback an Update
```bash
stallion rollback --project-id 6979abc9398fbe18cdf25772 --bundle-id <bundle-id>
```

---

## 🐛 Troubleshooting

### App Not Syncing Updates?

1. **Check Internet Connection**: Stallion needs network access
2. **Verify Credentials**: Ensure `StallionProjectId` and `StallionAppToken` are correct
3. **Check Console Logs**: Look for Stallion sync errors
4. **Restart App**: Sometimes a restart helps trigger sync

### Update Not Appearing?

1. **Wait a few seconds**: Sync happens on app start
2. **Check Bundle Version**: Ensure the bundle version matches
3. **Verify Platform**: Make sure you published for the correct platform (android/ios)

### Need Help?

- **Documentation**: https://learn.stalliontech.io
- **Support**: Check Stallion console for support options

---

## 📝 Quick Reference

**Your Configuration:**
- Project ID: `6979abc9398fbe18cdf25772`
- App Token: `spb_Z3j9x-uB_YTTmr0S8mu1wQRbIOkKZEf6FCWyd_miUT`
- Package: `react-native-stallion@2.3.2`

**Key Files:**
- `App.tsx` - Main app with Stallion setup
- `android/app/src/main/res/values/strings.xml` - Android config
- `ios/ReactNativeOta/Info.plist` - iOS config
- `android/app/src/main/java/com/reactnativeota/MainApplication.kt` - Android native setup

---

## 🎉 You're All Set!

Your app is now ready to receive OTA updates. Make changes, publish bundles, and update your app instantly without app store approval!

