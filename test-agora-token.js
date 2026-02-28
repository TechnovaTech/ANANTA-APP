// Test Agora token generation
const crypto = require('crypto');

const APP_ID = 'b6bbf782efa94f8b9894e9b5c1895dfa';
const APP_CERTIFICATE = 'YOUR_CERTIFICATE_HERE'; // Need the correct certificate
const CHANNEL_NAME = 'test_channel';
const UID = 12345;

console.log('Testing Agora credentials:');
console.log('App ID:', APP_ID);
console.log('Channel:', CHANNEL_NAME);
console.log('UID:', UID);

// This is a simplified test - you need the actual certificate from Agora Console
console.log('\nTo fix Error 110:');
console.log('1. Go to https://console.agora.io/');
console.log('2. Find project with App ID:', APP_ID);
console.log('3. Get the App Certificate');
console.log('4. Update the backend server certificate');
console.log('5. Or create a new Agora project with proper settings');