'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AppSettingsPage() {
  const [signupBonus, setSignupBonus] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/admin/app-settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSignupBonus(res.data.signupBonus || 0);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      setSaving(true);
      await axios.post('/api/admin/app-settings', { signupBonus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Settings saved successfully!');
    } catch (e) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{margin:0,fontSize:28,color:'#2d3748'}}>App Settings</h1>
        <p style={{margin:0,marginTop:8,color:'#718096',fontSize:14}}>
          Configure app-wide settings and bonuses.
        </p>
      </div>

      {loading ? (
        <p style={{color:'#718096'}}>Loading settings...</p>
      ) : (
        <div style={{background:'white',padding:24,borderRadius:8,border:'1px solid #e2e8f0',maxWidth:600}}>
          <div style={{marginBottom:24}}>
            <label style={{display:'block',marginBottom:8,fontSize:14,color:'#2d3748',fontWeight:600}}>
              Signup Bonus (Coins)
            </label>
            <p style={{margin:0,marginBottom:12,fontSize:13,color:'#718096'}}>
              Number of coins new users receive when they sign up.
            </p>
            <input
              type="number"
              value={signupBonus}
              onChange={e => setSignupBonus(Number(e.target.value))}
              min="0"
              style={{width:'100%',padding:'10px 12px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14}}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{padding:'10px 20px',borderRadius:6,border:'none',background:'#3182ce',color:'white',fontSize:14,cursor:'pointer',fontWeight:600}}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  );
}
