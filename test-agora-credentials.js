const https = require('https');

const APP_ID = '1e3b2dc019f2470da96bccb935b03c68';
const APP_CERTIFICATE = 'a6d22b34217848ea83d35e7dbc95f764';

console.log('🔍 Testing Agora Credentials...\n');
console.log('App ID:', APP_ID);
console.log('Certificate:', APP_CERTIFICATE);
console.log('\n' + '='.repeat(50) + '\n');

// Test 1: Check format
console.log('✓ Test 1: Format Check');
if (APP_ID.length === 32) {
  console.log('  ✓ App ID length: 32 characters (VALID)');
} else {
  console.log('  ✗ App ID length:', APP_ID.length, '(INVALID - should be 32)');
}

if (APP_CERTIFICATE.length === 32) {
  console.log('  ✓ Certificate length: 32 characters (VALID)');
} else {
  console.log('  ✗ Certificate length:', APP_CERTIFICATE.length, '(INVALID - should be 32)');
}

// Test 2: Check if hex format
const isHex = /^[a-f0-9]+$/i.test(APP_ID) && /^[a-f0-9]+$/i.test(APP_CERTIFICATE);
if (isHex) {
  console.log('  ✓ Format: Hexadecimal (VALID)');
} else {
  console.log('  ✗ Format: Not hexadecimal (INVALID)');
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Try to validate with Agora API
console.log('✓ Test 2: API Validation');
console.log('  Testing connection to Agora servers...\n');

const testChannel = 'test_' + Date.now();
const testUrl = `https://api.agora.io/dev/v1/projects`;

const options = {
  hostname: 'api.agora.io',
  path: '/dev/v1/projects',
  method: 'GET',
  headers: {
    'Authorization': 'Basic ' + Buffer.from(APP_ID + ':' + APP_CERTIFICATE).toString('base64'),
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('  Response Status:', res.statusCode);
    
    if (res.statusCode === 200) {
      console.log('\n✅ SUCCESS! Your Agora credentials are VALID!\n');
      console.log('  Your App ID and Certificate are working correctly.');
      console.log('  The issue must be something else.\n');
      console.log('🔍 Next Steps:');
      console.log('  1. Make sure backend is running on port 8082');
      console.log('  2. Clear browser cache (Ctrl+Shift+R)');
      console.log('  3. Check browser console for actual error');
      console.log('  4. Verify Signaling feature is enabled in Agora Console');
    } else if (res.statusCode === 401) {
      console.log('\n❌ FAILED! Your Agora credentials are INVALID!\n');
      console.log('  Error: Unauthorized (401)');
      console.log('  Your App ID or Certificate is incorrect.\n');
      console.log('🔧 Fix:');
      console.log('  1. Go to https://console.agora.io/');
      console.log('  2. Check your project');
      console.log('  3. Copy the correct App ID and Certificate');
      console.log('  4. Update application.properties');
    } else {
      console.log('\n⚠️  Unexpected response:', res.statusCode);
      console.log('  Response:', data);
    }
  });
});

req.on('error', (e) => {
  console.log('\n❌ Connection Error:', e.message);
  console.log('\n  Could not connect to Agora API.');
  console.log('  This might be a network issue, not credential issue.');
});

req.end();

console.log('  Waiting for response...');
