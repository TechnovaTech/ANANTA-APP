'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  REVIEWED: '#3182ce',
  DISMISSED: '#9ca3af',
};

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState<any>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to load reports', e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateReport = async (id: number, status: string) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/admin/reports/${id}`, { status, adminNote: note }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await load();
      setSelected(null);
      setNote('');
    } catch (e) {
      console.error('Failed to update report', e);
    }
    setSaving(false);
  };

  const filtered = filter === 'ALL' ? reports : reports.filter(r => r.status === filter);
  const counts = {
    ALL: reports.length,
    PENDING: reports.filter(r => r.status === 'PENDING').length,
    REVIEWED: reports.filter(r => r.status === 'REVIEWED').length,
    DISMISSED: reports.filter(r => r.status === 'DISMISSED').length,
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#1a202c' }}>User Reports</h2>
        <p style={{ margin: '6px 0 0', color: '#718096', fontSize: 15 }}>Review reports submitted by users</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {(['ALL', 'PENDING', 'REVIEWED', 'DISMISSED'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
            background: filter === s ? '#3182ce' : '#e2e8f0',
            color: filter === s ? 'white' : '#4a5568',
          }}>
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#718096' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#718096', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          No reports found
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(r => (
            <div key={r.id} style={{
              background: 'white', borderRadius: 12, padding: '18px 22px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'flex-start', gap: 16,
              borderLeft: `4px solid ${STATUS_COLORS[r.status] || '#ccc'}`,
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: '#1a202c', fontSize: 15 }}>Reported: {r.reportedUserName || r.reportedUserId}</span>
                  <span style={{
                    padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                    background: (STATUS_COLORS[r.status] || '#ccc') + '22', color: STATUS_COLORS[r.status] || '#ccc',
                  }}>{r.status}</span>
                </div>
                <div style={{ color: '#4a5568', fontSize: 14, marginBottom: 4 }}>
                  <strong>Reporter:</strong> {r.reporterName || r.reporterId}
                </div>
                <div style={{ color: '#4a5568', fontSize: 14, marginBottom: 4 }}>
                  <strong>Reason:</strong> {r.reason}
                </div>
                {r.adminNote && (
                  <div style={{ color: '#718096', fontSize: 13, fontStyle: 'italic' }}>Note: {r.adminNote}</div>
                )}
                <div style={{ color: '#a0aec0', fontSize: 12, marginTop: 6 }}>
                  {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>
              {r.status === 'PENDING' && (
                <button onClick={() => { setSelected(r); setNote(r.adminNote || ''); }} style={{
                  padding: '8px 16px', background: '#3182ce', color: 'white', border: 'none',
                  borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap',
                }}>
                  Review
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review modal */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
        }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: 480, maxWidth: '90vw' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>Review Report</h3>
            <p style={{ margin: '0 0 4px', color: '#718096', fontSize: 14 }}>
              Reported user: <strong>{selected.reportedUserName || selected.reportedUserId}</strong>
            </p>
            <p style={{ margin: '0 0 16px', color: '#718096', fontSize: 14 }}>
              Reporter: <strong>{selected.reporterName || selected.reporterId}</strong>
            </p>
            <div style={{ background: '#f7f8fc', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 14, color: '#4a5568', border: '1px solid #e2e8f0' }}>
              {selected.reason}
            </div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>Admin Note (optional)</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              style={{ width: '100%', borderRadius: 8, border: '1px solid #e2e8f0', padding: 10, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
              placeholder="Add a note..."
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => { setSelected(null); setNote(''); }} style={{
                padding: '10px 20px', background: '#e2e8f0', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
              }}>Cancel</button>
              <button onClick={() => updateReport(selected.id, 'DISMISSED')} disabled={saving} style={{
                padding: '10px 20px', background: '#718096', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
              }}>Dismiss</button>
              <button onClick={() => updateReport(selected.id, 'REVIEWED')} disabled={saving} style={{
                padding: '10px 20px', background: '#3182ce', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
              }}>{saving ? 'Saving...' : 'Mark Reviewed'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
