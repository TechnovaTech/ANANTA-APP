const API_BASE = 'http://localhost:3000';
const testUserId = 'AND6926A9B';

const payload = {
  userId: testUserId,
  username: 'MJ Rajput',
  fullName: 'MJ Rajput',
  bio: 'Updated via test script',
};

async function main() {
  console.log('🔄 Attempting to change name to: MJ Rajput');
  console.log('━'.repeat(50));
  
  const updateRes = await fetch(`${API_BASE}/api/app/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  console.log(`📤 Update Status: ${updateRes.status}`);
  
  if (updateRes.status !== 200) {
    console.log('❌ FAILED - Backend returned error');
    process.exit(1);
  }

  await new Promise(r => setTimeout(r, 1000));

  const getRes = await fetch(`${API_BASE}/api/app/profile/${testUserId}`);
  const getJson = await getRes.json();
  
  if (getJson && getJson.user) {
    const { username, fullName } = getJson.user;
    console.log(`📥 Current Name: ${username}`);
    console.log(`📥 Full Name: ${fullName}`);
    console.log('━'.repeat(50));
    
    if (username === 'MJ Rajput' && fullName === 'MJ Rajput') {
      console.log('✅ SUCCESS! Name changed to MJ Rajput');
      process.exit(0);
    } else {
      console.log('⚠️  Name not updated yet, will retry...');
      process.exit(1);
    }
  } else {
    console.log('❌ FAILED - Could not fetch user data');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
