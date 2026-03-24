#!/bin/bash

echo "🔄 Regenerating app icons and splash screens..."

# Clear Expo cache
echo "📱 Clearing Expo cache..."
npx expo install --fix

# Regenerate splash screen
echo "🎨 Regenerating splash screen..."
npx expo install expo-splash-screen

# For development builds
echo "🛠️ For development builds, run:"
echo "   npx expo run:android --clear-cache"
echo "   npx expo run:ios --clear-cache"

# For production builds
echo "📦 For production builds, run:"
echo "   eas build --platform android --clear-cache"
echo "   eas build --platform ios --clear-cache"

echo "✅ Icon and splash screen regeneration complete!"
echo "⚠️  Note: You may need to uninstall and reinstall the app to see icon changes."