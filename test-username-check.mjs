// Test script to check username validation API
const API_BASE_URL = 'https://ecofuelglobal.com';

async function testUsernameCheck() {
  console.log('=== Testing Username Check API ===\n');

  // Test 1: Check username without userId (should show taken if exists)
  console.log('Test 1: Checking "jgjfhd" without userId');
  try {
    const res1 = await fetch(`${API_BASE_URL}/api/app/check-username?username=jgjfhd`);
    const data1 = await res1.json();
    console.log('Response:', JSON.stringify(data1, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n---\n');

  // Test 2: Get user profile to find userId
  console.log('Test 2: Getting user profile for "jgjfhd"');
  try {
    // First, let's try to find the user by username
    const res2 = await fetch(`${API_BASE_URL}/api/app/profile/jgjfhd`);
    const data2 = await res2.json();
    console.log('User found:', data2.user ? 'Yes' : 'No');
    if (data2.user) {
      console.log('UserId:', data2.user.userId);
      console.log('Username:', data2.user.username);
      
      // Test 3: Check username WITH userId (should show available for own username)
      console.log('\n---\n');
      console.log('Test 3: Checking "jgjfhd" WITH userId:', data2.user.userId);
      const res3 = await fetch(`${API_BASE_URL}/api/app/check-username?username=jgjfhd&userId=${data2.user.userId}`);
      const data3 = await res3.json();
      console.log('Response:', JSON.stringify(data3, null, 2));
      console.log('Expected: available = true');
      console.log('Actual: available =', data3.available);
      
      // Test 4: Check different case
      console.log('\n---\n');
      console.log('Test 4: Checking "JGJFHD" (uppercase) WITH userId:', data2.user.userId);
      const res4 = await fetch(`${API_BASE_URL}/api/app/check-username?username=JGJFHD&userId=${data2.user.userId}`);
      const data4 = await res4.json();
      console.log('Response:', JSON.stringify(data4, null, 2));
      console.log('Expected: available = true (case-insensitive)');
      console.log('Actual: available =', data4.available);
      
      // Test 5: Check a different username
      console.log('\n---\n');
      console.log('Test 5: Checking "newusername123" WITH userId:', data2.user.userId);
      const res5 = await fetch(`${API_BASE_URL}/api/app/check-username?username=newusername123&userId=${data2.user.userId}`);
      const data5 = await res5.json();
      console.log('Response:', JSON.stringify(data5, null, 2));
      console.log('Expected: available = true (new username)');
      console.log('Actual: available =', data5.available);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n=== Test Complete ===');
}

testUsernameCheck();
