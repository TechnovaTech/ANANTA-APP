'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

type ReferralTier = { shares: number; coins: number };

export default function ReferralManagementPage() {
  const [tiers, setTiers] = useState<ReferralTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newShares, setNewShares] = useState('');
  const [newCoins, setNewCoins] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchTiers(); }, []);

  const fetchTiers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/referral', { headers: { Authorization: `Bearer ${token}` } });
      setTiers(res.data.tiers || []);
    } catch { setError('Failed to load tiers.'); } finally { setLoading(false); }
  };

  const addTier = () => {
    const shares = parseInt(newShares);
    const coins = parseInt(newCoins);
    if (!shares || shares <= 0 || !coins || coins <= 0) { setError('Enter valid shares and coins.'); return; }
    if (tiers.some(t => t.shares === shares)) { setError(`Tier for ${shares} share(s) already exists.`); return; }
    setError('');
    setTiers(prev => [...prev, { shares, coins }].sort((a, b) => a.shares - b.shares));
    setNewShares(''); setNewCoins('');
  };

  const removeTier = (shares: number) => setTiers(prev => prev.filter(t => t.shares !== shares));

  const updateCoins = (shares: number, value: string) =>
    setTiers(prev => prev.map(t => t.shares === shares ? { ...t, coins: parseInt(value) || 0 } : t));

  const saveTiers = async () => {
    setSaving(true); setSaved(false);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/referral', { tiers }, { headers: { Authorization: `Bearer ${token}` } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { setError('Failed to save. Try again.'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
      <p style={{ color: '#718096' }}>Loading...</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#1a202c', marginBottom: 6 }}>Referral Management</h1>
        <p style={{ margin: 0, color: '#718096', fontSize: 15 }}>Set how many coins a user earns per referral share milestone.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Add Tier Card */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: '#2d3748' }}>Add Reward Tier</h2>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#718096' }}>Define a share count → coin reward rule.</p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 4 }}>Shares Count</label>
              <input
                type="number" min="1" placeholder="e.g. 1"
                value={newShares} onChange={e => { setNewShares(e.target.value); setError(''); }}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 7, border: '1px solid #cbd5e0', fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 4 }}>Coins Reward</label>
              <input
                type="number" min="1" placeholder="e.g. 100"
                value={newCoins} onChange={e => { setNewCoins(e.target.value); setError(''); }}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 7, border: '1px solid #cbd5e0', fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {error && <p style={{ margin: '0 0 10px', fontSize: 13, color: '#e53e3e' }}>{error}</p>}

          <button onClick={addTier} style={{ padding: '9px 20px', background: '#3182ce', color: 'white', border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Add Tier
          </button>

          {newShares && newCoins && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: '#ebf8ff', borderRadius: 8, border: '1px solid #bee3f8' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#2b6cb0' }}>
                Preview: <strong>{newShares} share{parseInt(newShares) !== 1 ? 's' : ''}</strong> → <strong>{newCoins} coins</strong>
              </p>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 12, padding: 24, color: 'white' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🎁</div>
          <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>How It Works</h3>
          <p style={{ margin: '0 0 14px', fontSize: 14, opacity: 0.9, lineHeight: 1.6 }}>
            When a user shares the app and hits a milestone, they automatically receive the configured coin reward.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '12px 16px', marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8 }}>
              Example:<br />
              • 1 share → 100 coins<br />
              • 5 shares → 500 coins<br />
              • 10 shares → 1200 coins
            </p>
          </div>
          <p style={{ margin: 0, fontSize: 12, opacity: 0.75 }}>Total tiers: <strong>{tiers.length}</strong></p>
        </div>
      </div>

      {/* Tiers Table */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#2d3748' }}>Reward Tiers</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#718096' }}>Edit coins inline. Click Save All to apply changes.</p>
          </div>
          <button
            onClick={saveTiers} disabled={saving}
            style={{ padding: '10px 24px', background: saved ? '#38a169' : saving ? '#a0aec0' : '#3182ce', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved!' : '💾 Save All'}
          </button>
        </div>

        {tiers.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p style={{ margin: 0, color: '#718096', fontSize: 15 }}>No tiers yet. Add your first tier above.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                {['#', 'Shares Required', 'Coins Reward', 'Summary', 'Action'].map(h => (
                  <th key={h} style={{ padding: '14px 24px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, i) => (
                <tr key={tier.shares} style={{ borderBottom: i < tiers.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                  <td style={{ padding: '14px 24px', color: '#a0aec0', fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{ background: '#ebf8ff', color: '#2b6cb0', padding: '6px 14px', borderRadius: 20, fontSize: 14, fontWeight: 700 }}>
                      {tier.shares} share{tier.shares !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <input
                      type="number" min="1" value={tier.coins}
                      onChange={e => updateCoins(tier.shares, e.target.value)}
                      style={{ width: 110, padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e0', fontSize: 14, fontWeight: 600, color: '#2d3748' }}
                    />
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{ background: '#f0fff4', color: '#276749', padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                      {tier.shares} share{tier.shares !== 1 ? 's' : ''} → {tier.coins} coins
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <button
                      onClick={() => removeTier(tier.shares)}
                      style={{ padding: '6px 14px', background: '#fff5f5', color: '#c53030', border: '1px solid #fed7d7', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
