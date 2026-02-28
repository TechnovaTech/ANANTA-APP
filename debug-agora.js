// Quick test: Try joining without token (App ID only mode)
// This will help determine if the issue is with token generation or Agora project settings

// In video.tsx, temporarily replace the joinChannel call:
// await engine.joinChannel(null, channelName, joinUid, { clientRoleType: clientRole });

// If this works, the issue is with certificate/token generation
// If this fails, the issue is with the Agora project configuration

console.log('Test scenarios:');
console.log('1. Try null token - tests if project is in "Testing" mode');
console.log('2. Check Agora Console project settings');
console.log('3. Verify certificate matches the one used in backend');