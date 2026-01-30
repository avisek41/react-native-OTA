# Stallion OTA - Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Configuration](#configuration)
4. [API Reference](#api-reference)
5. [Implementation Details](#implementation-details)
6. [Update Workflow](#update-workflow)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [Reference](#reference)

---

## Overview

### What is Stallion?

Stallion is an Over-The-Air (OTA) update solution for React Native applications. It enables developers to push JavaScript bundle updates to production apps without requiring app store approval or user downloads of new APK/IPA files.

### Key Features

- **Instant Updates**: Deploy JavaScript changes without app store approval
- **Automatic Sync**: Apps automatically check for and download updates
- **Version Management**: Track and manage multiple bundle versions
- **Rollback Support**: Quickly revert to previous versions if issues occur
- **Analytics**: Monitor update adoption and device analytics
- **Cross-Platform**: Supports both Android and iOS

### Current Implementation

- **Package Version**: `react-native-stallion@2.3.2`
- **Project ID**: `6979abc9398fbe18cdf25772`
- **React Native Version**: `0.83.1`
- **New Architecture**: Enabled (RCTNewArchEnabled: true)

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Stallion Cloud Service                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Bundle     │  │   Analytics  │  │   Version    │       │
│  │   Storage    │  │   Tracking   │  │   Management │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│              React Native Application                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         react-native-stallion SDK                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │   │
│  │  │   Sync       │  │   Download   │  │  Restart │  │   │
│  │  │   Manager    │  │   Manager    │  │  Handler │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Native Modules (Android/iOS)                   │   │
│  │  ┌──────────────┐  ┌──────────────┐                 │   │
│  │  │   Bundle     │  │   Config     │                 │   │
│  │  │   Loader     │  │   Manager    │                 │   │
│  │  └──────────────┘  └──────────────┘                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Initialization**: App reads configuration from native resources
2. **Sync Check**: App checks Stallion server for available updates
3. **Download**: If update available, bundle is downloaded in background
4. **Verification**: Bundle is verified for integrity
5. **Installation**: Bundle is prepared for next app restart
6. **Restart**: App restarts to load new bundle

---

## Configuration

### Android Configuration

#### 1. Native Module Setup

**File**: `android/app/src/main/java/com/reactnativeota/MainApplication.kt`

```kotlin
import com.stallion.Stallion

class MainApplication : Application(), ReactApplication {
  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList = PackageList(this).packages,
      jsBundleFilePath = Stallion.getJSBundleFile(applicationContext)
    )
  }
}
```

**Key Points**:
- `Stallion.getJSBundleFile()` intercepts bundle loading
- Returns path to latest OTA bundle if available, otherwise default bundle
- Must be set in `jsBundleFilePath` parameter

#### 2. Resource Configuration

**File**: `android/app/src/main/res/values/strings.xml`

```xml
<resources>
    <string name="app_name">ReactNativeOta</string>
    <string name="StallionProjectId">6979abc9398fbe18cdf25772</string>
    <string name="StallionAppToken">spb_Z3j9x-uB_YTTmr0S8mu1wQRbIOkKZEf6FCWyd_miUT</string>
</resources>
```

**Configuration Requirements**:
- `StallionProjectId`: Unique project identifier (24 characters)
- `StallionAppToken`: Authentication token (must start with `spb_` and be 46 characters)

### iOS Configuration

#### 1. Info.plist Configuration

**File**: `ios/ReactNativeOta/Info.plist`

```xml
<!-- Stallion OTA Configuration -->
<key>StallionProjectId</key>
<string>6979abc9398fbe18cdf25772</string>
<key>StallionAppToken</key>
<string>spb_Z3j9x-uB_YTTmr0S8mu1wQRbIOkKZEf6FCWyd_miUT</string>
```

**Note**: iOS uses Info.plist for configuration, while Android uses strings.xml

#### 2. App Transport Security

Ensure ATS allows connections to Stallion servers:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
    <key>NSAllowsLocalNetworking</key>
    <true/>
</dict>
```

### JavaScript Configuration

#### 1. Package Installation

```json
{
  "dependencies": {
    "react-native-stallion": "^2.3.2"
  }
}
```

#### 2. App Wrapper

**File**: `App.tsx`

```typescript
import { withStallion } from 'react-native-stallion';

// Wrap root component
export default withStallion(App);
```

**Purpose**: 
- `withStallion` HOC initializes Stallion SDK
- Sets up event listeners and sync mechanisms
- Must wrap the root component

---

## API Reference

### Hooks

#### `useStallionUpdate()`

Returns update state and information.

**Returns**:
```typescript
{
  isRestartRequired: boolean;
  newReleaseBundle?: {
    version: string;
    releaseNote?: string;
    // ... other bundle metadata
  };
}
```

**Usage**:
```typescript
const { isRestartRequired, newReleaseBundle } = useStallionUpdate();

useEffect(() => {
  if (isRestartRequired) {
    // Show update notification
    Alert.alert(
      'Update Available',
      `Version ${newReleaseBundle?.version} is ready to install`
    );
  }
}, [isRestartRequired, newReleaseBundle]);
```

### Functions

#### `sync()`

Manually trigger a sync check with Stallion server.

**Signature**:
```typescript
sync(): void
```

**Usage**:
```typescript
import { sync } from 'react-native-stallion';

// Check for updates when app comes to foreground
useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      sync(); // Check for updates
    }
  });

  return () => subscription.remove();
}, []);
```

**Behavior**:
- Checks Stallion server for available updates
- Downloads bundle if update is available
- Sets `isRestartRequired` flag when download completes
- Non-blocking operation

#### `restart()`

Restart the app to apply downloaded update.

**Signature**:
```typescript
restart(): void
```

**Usage**:
```typescript
import { restart } from 'react-native-stallion';

const handleUpdate = () => {
  restart(); // App will restart and load new bundle
};
```

**Behavior**:
- Immediately restarts the application
- On restart, app loads the newly downloaded bundle
- User sees updated JavaScript code

### Higher-Order Component

#### `withStallion(Component)`

Wraps root component to enable Stallion functionality.

**Signature**:
```typescript
withStallion<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P>
```

**Usage**:
```typescript
import { withStallion } from 'react-native-stallion';

const App = () => {
  // Your app code
};

export default withStallion(App);
```

**What it does**:
- Initializes Stallion SDK on mount
- Sets up automatic sync on app start
- Handles lifecycle events
- Must be applied to root component only

---

## Implementation Details

### Current Implementation

**File**: `App.tsx`

#### Update Detection

```typescript
const { isRestartRequired, newReleaseBundle } = useStallionUpdate();

useEffect(() => {
  if (isRestartRequired) {
    Alert.alert(
      'New Release Installed',
      `Release: ${newReleaseBundle?.version || 'Unknown'}\nNote: ${newReleaseBundle?.releaseNote || 'No release notes'}`,
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Restart Now', onPress: () => restart() }
      ]
    );
  }
}, [isRestartRequired, newReleaseBundle]);
```

#### Automatic Sync

```typescript
useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      sync(); // Check for updates when app comes to foreground
    }
  });

  // Initial sync on mount
  sync();

  return () => subscription.remove();
}, []);
```

### Update Modal Component

A custom modal component handles update notifications:

```typescript
const UpdateModal: React.FC = () => {
  const { isRestartRequired } = useStallionUpdate();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isRestartRequired) {
      setModalVisible(true);
    }
  }, [isRestartRequired]);

  const handleRestart = () => {
    setModalVisible(false);
    restart();
  };

  return (
    <Modal transparent visible={modalVisible}>
      {/* Modal UI */}
    </Modal>
  );
};
```

### Bundle Loading Flow

1. **App Launch**: 
   - Native code calls `Stallion.getJSBundleFile()`
   - Checks for downloaded OTA bundle
   - Returns OTA bundle path if available, otherwise default bundle

2. **Bundle Execution**:
   - React Native loads bundle from returned path
   - JavaScript code executes

3. **Update Check**:
   - `withStallion` HOC triggers initial sync
   - SDK checks server for updates

4. **Download**:
   - If update available, downloads in background
   - Stores bundle in app's private directory

5. **Installation**:
   - Sets `isRestartRequired` flag
   - App shows update notification

6. **Restart**:
   - User triggers restart
   - App loads new bundle on next launch

---

## Update Workflow

### Developer Workflow

#### 1. Make Code Changes

Edit your React Native code (e.g., `App.tsx`):

```typescript
// Before
<Text>Welcome to the App</Text>

// After
<Text>Welcome to the Updated App!</Text>
```

#### 2. Build JavaScript Bundle

**Android**:
```bash
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res/
```

**iOS**:
```bash
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios/
```

#### 3. Publish to Stallion

```bash
# Install CLI (if not already installed)
npm install -g @stallion/cli

# Login
stallion login

# Publish bundle
stallion publish \
  --project-id 6979abc9398fbe18cdf25772 \
  --bundle-path android/app/src/main/assets/index.android.bundle \
  --platform android
```

#### 4. Monitor Deployment

- Check Stallion Console: https://console.stalliontech.io/
- View update adoption rates
- Monitor for errors

### User Experience Flow

1. **App Running**: User has app open
2. **Update Available**: Developer publishes update
3. **Background Download**: App automatically downloads update (next sync check)
4. **Notification**: App shows "Update Available" alert/modal
5. **User Action**: User chooses "Restart Now" or "Later"
6. **Restart**: If user chooses restart, app restarts
7. **New Version**: App loads with updated JavaScript code

### Sync Triggers

Updates are checked in the following scenarios:

1. **App Launch**: Initial sync when app starts
2. **Foreground**: When app comes to foreground (AppState change)
3. **Manual**: When `sync()` is called programmatically

---

## Security Considerations

### Authentication

- **App Token**: Used to authenticate app with Stallion servers
- **Format**: Must start with `spb_` prefix
- **Storage**: Stored in native configuration files (strings.xml/Info.plist)
- **Security**: Never commit tokens to public repositories

### Bundle Integrity

- Stallion SDK verifies bundle integrity before installation
- Bundles are signed and verified
- Prevents tampering with downloaded bundles

### Network Security

- All communications use HTTPS
- App Transport Security (iOS) and Network Security Config (Android) enforced
- No unencrypted connections

### Best Practices

1. **Token Management**:
   - Use environment variables for different environments
   - Rotate tokens periodically
   - Never expose tokens in client-side code

2. **Update Validation**:
   - Test updates in staging environment first
   - Use gradual rollouts for critical updates
   - Monitor error rates after deployment

3. **Rollback Strategy**:
   - Always keep previous stable version available
   - Test rollback procedure
   - Monitor for issues after update

---

## Troubleshooting

### Common Issues

#### 1. Updates Not Syncing

**Symptoms**:
- App doesn't detect new updates
- No sync activity in logs

**Solutions**:
- Verify internet connection
- Check `StallionProjectId` and `StallionAppToken` are correct
- Ensure app has network permissions
- Check console logs for sync errors
- Try manual sync: `sync()`

#### 2. Update Not Appearing After Restart

**Symptoms**:
- Restarted app but changes not visible
- Still seeing old version

**Solutions**:
- Verify bundle was published for correct platform (android/ios)
- Check bundle version matches
- Ensure bundle was successfully published (check Stallion console)
- Clear app cache and restart
- Verify `Stallion.getJSBundleFile()` is correctly configured

#### 3. App Crashes After Update

**Symptoms**:
- App crashes on launch after update
- JavaScript errors in logs

**Solutions**:
- Check bundle for syntax errors
- Verify all dependencies are included
- Test bundle locally before publishing
- Use rollback: `stallion rollback --project-id <id> --bundle-id <bundle-id>`

#### 4. Bundle Build Failures

**Symptoms**:
- `react-native bundle` command fails
- Missing assets or modules

**Solutions**:
- Ensure all dependencies are installed: `npm install`
- Check Metro bundler is running: `npm start`
- Verify entry file exists: `index.js`
- Check for syntax errors in code

### Debugging

#### Enable Verbose Logging

Add logging to track Stallion operations:

```typescript
useEffect(() => {
  console.log('Stallion Status:', {
    isRestartRequired,
    newReleaseBundle
  });
}, [isRestartRequired, newReleaseBundle]);
```

#### Check Stallion Status

```bash
stallion status --project-id 6979abc9398fbe18cdf25772
```

#### List Published Bundles

```bash
stallion list --project-id 6979abc9398fbe18cdf25772
```

### Verification Checklist

- [ ] `StallionProjectId` matches project ID in console
- [ ] `StallionAppToken` is correct and starts with `spb_`
- [ ] App has internet permissions (AndroidManifest.xml/Info.plist)
- [ ] `withStallion` wraps root component
- [ ] Native configuration files are correct
- [ ] Bundle was published for correct platform
- [ ] App version matches bundle version requirements

---

## Best Practices

### Development

1. **Test Locally First**:
   - Test bundle locally before publishing
   - Use development builds to verify changes

2. **Version Management**:
   - Use semantic versioning for bundles
   - Include release notes for each update
   - Tag important updates

3. **Gradual Rollouts**:
   - Start with small percentage of users
   - Monitor error rates
   - Gradually increase rollout

4. **Error Handling**:
   - Implement proper error boundaries
   - Handle update failures gracefully
   - Provide fallback mechanisms

### Deployment

1. **Pre-Deployment**:
   - Review all changes
   - Test in staging environment
   - Verify bundle builds successfully

2. **Deployment**:
   - Publish during low-traffic periods
   - Monitor Stallion console for errors
   - Have rollback plan ready

3. **Post-Deployment**:
   - Monitor error rates
   - Track update adoption
   - Gather user feedback

### Code Organization

1. **Separation of Concerns**:
   - Keep update logic separate from business logic
   - Use custom hooks for update management
   - Create reusable update components

2. **Error Boundaries**:
   ```typescript
   class UpdateErrorBoundary extends React.Component {
     // Handle update-related errors
   }
   ```

3. **Testing**:
   - Test update flow in development
   - Use test IDs for E2E testing
   - Mock Stallion SDK in unit tests

### Performance

1. **Bundle Size**:
   - Keep bundles small for faster downloads
   - Use code splitting where possible
   - Optimize assets

2. **Sync Frequency**:
   - Don't sync too frequently (battery/network impact)
   - Sync on app foreground is sufficient
   - Allow manual sync option

3. **User Experience**:
   - Show update progress when downloading
   - Allow users to defer updates
   - Provide clear update notifications

---

## Reference

### Configuration Files

| Platform | File | Purpose |
|----------|------|---------|
| Android | `android/app/src/main/res/values/strings.xml` | Project ID and Token |
| Android | `android/app/src/main/java/.../MainApplication.kt` | Bundle loading |
| iOS | `ios/ReactNativeOta/Info.plist` | Project ID and Token |
| JavaScript | `App.tsx` | SDK initialization |

### CLI Commands

```bash
# Install CLI
npm install -g @stallion/cli

# Login
stallion login

# Publish bundle
stallion publish --project-id <id> --bundle-path <path> --platform <platform>

# Check status
stallion status --project-id <id>

# List bundles
stallion list --project-id <id>

# Rollback
stallion rollback --project-id <id> --bundle-id <bundle-id>
```

### Project Information

- **Project ID**: `6979abc9398fbe18cdf25772`
- **App Token**: `spb_Z3j9x-uB_YTTmr0S8mu1wQRbIOkKZEf6FCWyd_miUT`
- **Package**: `react-native-stallion@2.3.2`
- **Console**: https://console.stalliontech.io/
- **Documentation**: https://learn.stalliontech.io

### Key Files

- `App.tsx` - Main app with Stallion integration
- `android/app/src/main/res/values/strings.xml` - Android configuration
- `ios/ReactNativeOta/Info.plist` - iOS configuration
- `android/app/src/main/java/com/reactnativeota/MainApplication.kt` - Android native setup
- `STALLION_SETUP_GUIDE.md` - Setup and quick start guide

### Support Resources

- **Official Documentation**: https://learn.stalliontech.io
- **Stallion Console**: https://console.stalliontech.io/
- **Support**: Available through Stallion console

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.3.2 | Current | Current implementation |
| - | - | - |

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: Development Team

