const API_BASE = 'http://localhost:3000';

async function cleanupSessions() {
  console.log('🧹 Cleaning up old live sessions...');
  
  try {
    const res = await fetch(`${API_BASE}/api/app/live/cleanup`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      console.log('❌ Cleanup failed');
      process.exit(1);
    }
    
    const data = await res.json();
    console.log(`✅ ${data.message}`);
    console.log(`📊 Deleted ${data.deleted} old sessions`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

cleanupSessions();
