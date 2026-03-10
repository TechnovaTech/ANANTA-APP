'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type HostLevel = {
  id: number;
  level: number;
  coinsRequired: number;
};

type ViewerLevel = {
  id: number;
  level: number;
  coinsRequired: number;
};

export default function LevelManagementPage() {
  const [activeTab, setActiveTab] = useState<'host' | 'viewer'>('host');
  
  const [hostLevels, setHostLevels] = useState<HostLevel[]>([]);
  const [loadingHostLevels, setLoadingHostLevels] = useState(true);
  const [savingHostLevel, setSavingHostLevel] = useState(false);
  const [editingHostLevels, setEditingHostLevels] = useState<Set<number>>(new Set());

  const [viewerLevels, setViewerLevels] = useState<ViewerLevel[]>([]);
  const [loadingViewerLevels, setLoadingViewerLevels] = useState(true);
  const [savingViewerLevel, setSavingViewerLevel] = useState(false);
  const [editingViewerLevels, setEditingViewerLevels] = useState<Set<number>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchHostLevels = async () => {
      try {
        const res = await axios.get('/api/admin/levels/host', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHostLevels(res.data.levels || []);
      } catch (e) {
      } finally {
        setLoadingHostLevels(false);
      }
    };

    const fetchViewerLevels = async () => {
      try {
        const res = await axios.get('/api/admin/levels/viewer', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setViewerLevels(res.data.levels || []);
      } catch (e) {
      } finally {
        setLoadingViewerLevels(false);
      }
    };

    fetchHostLevels();
    fetchViewerLevels();
  }, []);

  const calculateCumulative = (levels: any[], index: number) => {
    return levels.slice(0, index + 1).reduce((sum, level) => sum + level.coinsRequired, 0);
  };

  const handleHostLevelChange = (index: number, field: keyof HostLevel, value: any) => {
    setHostLevels(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSaveHostLevel = async (level: HostLevel, index: number) => {
    const token = localStorage.getItem('token');
    try {
      setSavingHostLevel(true);
      if (level.id) {
        const res = await axios.put(`/api/admin/levels/host/${level.id}`, level, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHostLevels(prev => prev.map(l => (l.id === level.id ? res.data : l)));
        setEditingHostLevels(prev => {
          const newSet = new Set(prev);
          newSet.delete(level.id);
          return newSet;
        });
      } else {
        const res = await axios.post('/api/admin/levels/host', level, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHostLevels(prev => {
          const filtered = prev.filter(l => l.id !== 0);
          return [...filtered, res.data];
        });
      }
    } catch (e) {
      alert('Error saving level');
    } finally {
      setSavingHostLevel(false);
    }
  };

  const handleDeleteHostLevel = async (levelId: number) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Delete this level?')) return;
    try {
      await axios.delete(`/api/admin/levels/host/${levelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHostLevels(prev => prev.filter(l => l.id !== levelId));
    } catch (e) {
      alert('Error deleting level');
    }
  };

  const handleViewerLevelChange = (index: number, field: keyof ViewerLevel, value: any) => {
    setViewerLevels(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSaveViewerLevel = async (level: ViewerLevel, index: number) => {
    const token = localStorage.getItem('token');
    try {
      setSavingViewerLevel(true);
      if (level.id) {
        const res = await axios.put(`/api/admin/levels/viewer/${level.id}`, level, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setViewerLevels(prev => prev.map(l => (l.id === level.id ? res.data : l)));
        setEditingViewerLevels(prev => {
          const newSet = new Set(prev);
          newSet.delete(level.id);
          return newSet;
        });
      } else {
        const res = await axios.post('/api/admin/levels/viewer', level, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setViewerLevels(prev => {
          const filtered = prev.filter(l => l.id !== 0);
          return [...filtered, res.data];
        });
      }
    } catch (e) {
      alert('Error saving level');
    } finally {
      setSavingViewerLevel(false);
    }
  };

  const handleDeleteViewerLevel = async (levelId: number) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Delete this level?')) return;
    try {
      await axios.delete(`/api/admin/levels/viewer/${levelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setViewerLevels(prev => prev.filter(l => l.id !== levelId));
    } catch (e) {
      alert('Error deleting level');
    }
  };

  const renderHostTab = () => (
    <div>
      <h2 style={{marginTop:0,marginBottom:16,fontSize:24,color:'#2d3748'}}>Host Levels</h2>
      <p style={{marginTop:0,marginBottom:24,color:'#718096',fontSize:14}}>
        Manage host levels based on coins earned. Higher levels unlock more features.
      </p>

      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
        <button
          onClick={() =>
            setHostLevels(prev => [
              ...prev,
              { id: 0, level: prev.length + 1, coinsRequired: 0 },
            ])
          }
          style={{padding:'8px 14px',borderRadius:6,border:'none',background:'#3182ce',color:'white',fontSize:13,cursor:'pointer',fontWeight:600}}
        >
          Add Level
        </button>
      </div>

      {loadingHostLevels ? (
        <p style={{color:'#718096'}}>Loading levels...</p>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {hostLevels.map((level, index) => {
            const isEditing = level.id === 0 || editingHostLevels.has(level.id);
            return (
            <div key={`${level.id}-${index}`} style={{background:'white',padding:16,borderRadius:8,border:'1px solid #e2e8f0',display:'flex',alignItems:'center',gap:16}}>
              <div style={{flex:1}}>
                <label style={{display:'block',marginBottom:4,fontSize:13,color:'#4a5568'}}>Level</label>
                <input
                  type="number"
                  value={level.level}
                  onChange={e => handleHostLevelChange(index, 'level', Number(e.target.value))}
                  disabled={!isEditing}
                  style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14,background:isEditing?'white':'#f7fafc'}}
                />
              </div>
              <div style={{flex:2}}>
                <label style={{display:'block',marginBottom:4,fontSize:13,color:'#4a5568'}}>Coins to Earn</label>
                <input
                  type="number"
                  value={level.coinsRequired}
                  onChange={e => handleHostLevelChange(index, 'coinsRequired', Number(e.target.value))}
                  disabled={!isEditing}
                  style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14,background:isEditing?'white':'#f7fafc'}}
                />
              </div>
              <div style={{flex:2}}>
                <label style={{display:'block',marginBottom:4,fontSize:13,color:'#4a5568'}}>Cumulative Coins</label>
                <div style={{padding:'8px 10px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14,background:'#f7fafc',color:'#4a5568'}}>
                  {calculateCumulative(hostLevels, index).toLocaleString()}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {isEditing ? (
                  <button
                    onClick={() => handleSaveHostLevel(level, index)}
                    disabled={savingHostLevel}
                    style={{padding:'8px 12px',borderRadius:6,border:'none',background:'#3182ce',color:'white',fontSize:13,cursor:'pointer'}}
                  >
                    {savingHostLevel ? 'Saving...' : 'Save'}
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingHostLevels(prev => {
                      const newSet = new Set(prev);
                      newSet.add(level.id);
                      return newSet;
                    })}
                    style={{padding:'8px 12px',borderRadius:6,border:'1px solid #3182ce',background:'white',color:'#3182ce',fontSize:13,cursor:'pointer'}}
                  >
                    Edit
                  </button>
                )}
                {level.id && (
                  <button
                    onClick={() => handleDeleteHostLevel(level.id)}
                    style={{padding:'8px 12px',borderRadius:6,border:'1px solid #e53e3e',background:'white',color:'#e53e3e',fontSize:13,cursor:'pointer'}}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderViewerTab = () => (
    <div>
      <h2 style={{marginTop:0,marginBottom:16,fontSize:24,color:'#2d3748'}}>Viewer Levels</h2>
      <p style={{marginTop:0,marginBottom:24,color:'#718096',fontSize:14}}>
        Manage viewer levels based on coins spent. Higher levels unlock more features.
      </p>

      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
        <button
          onClick={() =>
            setViewerLevels(prev => [
              ...prev,
              { id: 0, level: prev.length + 1, coinsRequired: 0 },
            ])
          }
          style={{padding:'8px 14px',borderRadius:6,border:'none',background:'#3182ce',color:'white',fontSize:13,cursor:'pointer',fontWeight:600}}
        >
          Add Level
        </button>
      </div>

      {loadingViewerLevels ? (
        <p style={{color:'#718096'}}>Loading levels...</p>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {viewerLevels.map((level, index) => {
            const isEditing = level.id === 0 || editingViewerLevels.has(level.id);
            return (
            <div key={`${level.id}-${index}`} style={{background:'white',padding:16,borderRadius:8,border:'1px solid #e2e8f0',display:'flex',alignItems:'center',gap:16}}>
              <div style={{flex:1}}>
                <label style={{display:'block',marginBottom:4,fontSize:13,color:'#4a5568'}}>Level</label>
                <input
                  type="number"
                  value={level.level}
                  onChange={e => handleViewerLevelChange(index, 'level', Number(e.target.value))}
                  disabled={!isEditing}
                  style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14,background:isEditing?'white':'#f7fafc'}}
                />
              </div>
              <div style={{flex:2}}>
                <label style={{display:'block',marginBottom:4,fontSize:13,color:'#4a5568'}}>Coins to Spend</label>
                <input
                  type="number"
                  value={level.coinsRequired}
                  onChange={e => handleViewerLevelChange(index, 'coinsRequired', Number(e.target.value))}
                  disabled={!isEditing}
                  style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14,background:isEditing?'white':'#f7fafc'}}
                />
              </div>
              <div style={{flex:2}}>
                <label style={{display:'block',marginBottom:4,fontSize:13,color:'#4a5568'}}>Cumulative Coins</label>
                <div style={{padding:'8px 10px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14,background:'#f7fafc',color:'#4a5568'}}>
                  {calculateCumulative(viewerLevels, index).toLocaleString()}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {isEditing ? (
                  <button
                    onClick={() => handleSaveViewerLevel(level, index)}
                    disabled={savingViewerLevel}
                    style={{padding:'8px 12px',borderRadius:6,border:'none',background:'#3182ce',color:'white',fontSize:13,cursor:'pointer'}}
                  >
                    {savingViewerLevel ? 'Saving...' : 'Save'}
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingViewerLevels(prev => {
                      const newSet = new Set(prev);
                      newSet.add(level.id);
                      return newSet;
                    })}
                    style={{padding:'8px 12px',borderRadius:6,border:'1px solid #3182ce',background:'white',color:'#3182ce',fontSize:13,cursor:'pointer'}}
                  >
                    Edit
                  </button>
                )}
                {level.id && (
                  <button
                    onClick={() => handleDeleteViewerLevel(level.id)}
                    style={{padding:'8px 12px',borderRadius:6,border:'1px solid #e53e3e',background:'white',color:'#e53e3e',fontSize:13,cursor:'pointer'}}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{margin:0,fontSize:28,color:'#2d3748'}}>Level Management</h1>
        <p style={{margin:0,marginTop:8,color:'#718096',fontSize:14}}>
          Configure host and viewer level requirements.
        </p>
      </div>

      <div style={{display:'flex',borderBottom:'1px solid #e2e8f0',marginBottom:24}}>
        <button
          onClick={() => setActiveTab('host')}
          style={{
            padding:'10px 20px',
            border:'none',
            borderBottom: activeTab === 'host' ? '3px solid #3182ce' : '3px solid transparent',
            background:'transparent',
            color: activeTab === 'host' ? '#2d3748' : '#718096',
            fontWeight: activeTab === 'host' ? 600 : 500,
            cursor:'pointer',
          }}
        >
          Host Levels
        </button>
        <button
          onClick={() => setActiveTab('viewer')}
          style={{
            padding:'10px 20px',
            border:'none',
            borderBottom: activeTab === 'viewer' ? '3px solid #3182ce' : '3px solid transparent',
            background:'transparent',
            color: activeTab === 'viewer' ? '#2d3748' : '#718096',
            fontWeight: activeTab === 'viewer' ? 600 : 500,
            cursor:'pointer',
          }}
        >
          Viewer Levels
        </button>
      </div>

      {activeTab === 'host' ? renderHostTab() : renderViewerTab()}
    </div>
  );
}