// Test if backend is running
const API_BASE_URL = 'https://ecofuelglobal.com';

async function testBackend() {
  console.log('Testing backend health...\n');
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/app/health`);
    const data = await res.json();
    console.log('Backend Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (res.status === 200) {
      console.log('\n✅ Backend is running!');
      console.log('\nNow testing check-username endpoint...');
      
      const res2 = await fetch(`${API_BASE_URL}/api/app/check-username?username=testuser`);
      console.log('check-username Status:', res2.status);
      
      if (res2.status === 404) {
        console.log('❌ check-username endpoint NOT FOUND (404)');
        console.log('This means the endpoint is not registered in the backend.');
        console.log('\nPossible reasons:');
        console.log('1. Backend code was not recompiled after adding the endpoint');
        console.log('2. Backend server needs to be restarted');
        console.log('3. The endpoint path is incorrect');
      } else {
        const data2 = await res2.json();
        console.log('✅ check-username endpoint is working!');
        console.log('Response:', JSON.stringify(data2, null, 2));
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nBackend might not be running or not accessible.');
  }
}

testBackend();
