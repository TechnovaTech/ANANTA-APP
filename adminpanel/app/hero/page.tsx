'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type HeroItem = {
  id: number;
  title: string;
  subtitle: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  active: boolean;
  sortOrder: number;
};

const emptyHero: HeroItem = {
  id: 0,
  title: '',
  subtitle: '',
  mediaUrl: '',
  mediaType: 'IMAGE',
  active: true,
  sortOrder: 0,
};

export default function HeroPage() {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<HeroItem | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const resolveMediaUrl = (value: string) => {
    if (!value) return '';
    if (value.startsWith('http') || value.startsWith('data:')) return value;
    if (value.startsWith('/uploads/')) return `http://localhost:3000${value}`;
    return value;
  };

  const loadItems = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/admin/hero', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data.items || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    const token = localStorage.getItem('token');
    try {
      setSaving(true);
      const form = new FormData();
      if (editing.id) form.append('id', String(editing.id));
      form.append('title', editing.title || '');
      form.append('subtitle', editing.subtitle || '');
      form.append('mediaType', editing.mediaType || 'IMAGE');
      form.append('active', String(editing.active));
      form.append('sortOrder', String(editing.sortOrder ?? 0));
      if (mediaFile) {
        form.append('media', mediaFile);
      }
      const res = await axios.post('/api/admin/hero/save', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const saved = res.data;
      setItems(prev => {
        if (editing.id) {
          return prev.map(item => (item.id === editing.id ? saved : item));
        }
        return [saved, ...prev];
      });
      setEditing(saved);
      setMediaFile(null);
    } catch {
      alert('Error saving hero');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Delete this hero item?')) return;
    try {
      await axios.delete(`/api/admin/hero/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(prev => prev.filter(item => item.id !== id));
      if (editing?.id === id) {
        setEditing(null);
        setMediaFile(null);
      }
    } catch {
      alert('Error deleting hero');
    }
  };

  return (
    <div style={{flex:1,marginLeft:280,padding:32}}>
      <div style={{marginBottom:24}}>
        <h1 style={{margin:0,fontSize:28,color:'#2d3748'}}>Hero Section</h1>
        <p style={{margin:0,marginTop:8,color:'#718096',fontSize:14}}>
          Manage hero images and videos shown on the app home carousel.
        </p>
      </div>

      <div style={{marginBottom:20}}>
        <button
          onClick={() => {
            setEditing({ ...emptyHero });
            setMediaFile(null);
          }}
          style={{padding:'8px 16px',borderRadius:8,border:'none',background:'#3182ce',color:'white',fontSize:14,cursor:'pointer'}}
        >
          New Hero
        </button>
      </div>

      {editing && (
        <div style={{background:'white',padding:16,borderRadius:8,border:'1px solid #e2e8f0',marginBottom:24}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div>
              <label style={{display:'block',marginBottom:6,fontSize:13,color:'#4a5568'}}>Title</label>
              <input
                value={editing.title}
                onChange={e => setEditing(prev => prev ? { ...prev, title: e.target.value } : prev)}
                style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14}}
              />
            </div>
            <div>
              <label style={{display:'block',marginBottom:6,fontSize:13,color:'#4a5568'}}>Subtitle</label>
              <input
                value={editing.subtitle}
                onChange={e => setEditing(prev => prev ? { ...prev, subtitle: e.target.value } : prev)}
                style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14}}
              />
            </div>
            <div>
              <label style={{display:'block',marginBottom:6,fontSize:13,color:'#4a5568'}}>Media Type</label>
              <select
                value={editing.mediaType}
                onChange={e => setEditing(prev => prev ? { ...prev, mediaType: e.target.value as HeroItem['mediaType'] } : prev)}
                style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14}}
              >
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
              </select>
            </div>
            <div>
              <label style={{display:'block',marginBottom:6,fontSize:13,color:'#4a5568'}}>Sort Order</label>
              <input
                type="number"
                value={editing.sortOrder}
                onChange={e => setEditing(prev => prev ? { ...prev, sortOrder: Number(e.target.value) } : prev)}
                style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14}}
              />
            </div>
            <div>
              <label style={{display:'block',marginBottom:6,fontSize:13,color:'#4a5568'}}>Active</label>
              <select
                value={editing.active ? 'true' : 'false'}
                onChange={e => setEditing(prev => prev ? { ...prev, active: e.target.value === 'true' } : prev)}
                style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #e2e8f0',fontSize:14}}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div>
              <label style={{display:'block',marginBottom:6,fontSize:13,color:'#4a5568'}}>Media File</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={e => setMediaFile(e.target.files ? e.target.files[0] : null)}
                style={{width:'100%',padding:'8px 0',fontSize:14}}
              />
            </div>
          </div>

          <div style={{display:'flex',gap:12}}>
            <button
              onClick={handleSave}
              style={{padding:'8px 16px',borderRadius:8,border:'none',background:'#3182ce',color:'white',fontSize:14,cursor:'pointer'}}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setMediaFile(null);
              }}
              style={{padding:'8px 16px',borderRadius:8,border:'1px solid #e2e8f0',background:'white',color:'#4a5568',fontSize:14,cursor:'pointer'}}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{color:'#718096'}}>Loading hero items...</p>
      ) : items.length === 0 ? (
        <div style={{textAlign:'center',padding:64,background:'white',borderRadius:12,border:'1px solid #e2e8f0'}}>
          <div style={{fontSize:48,marginBottom:16,opacity:0.5}}>🖼️</div>
          <h3 style={{margin:0,color:'#4a5568',fontSize:18,marginBottom:8}}>No hero items</h3>
          <p style={{margin:0,color:'#718096'}}>Create a hero item to show on the app home carousel.</p>
        </div>
      ) : (
        <div style={{background:'white',borderRadius:12,border:'1px solid #e2e8f0',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f8fafc',textAlign:'left'}}>
                <th style={{padding:'12px 16px',fontSize:12,color:'#718096',fontWeight:600}}>Preview</th>
                <th style={{padding:'12px 16px',fontSize:12,color:'#718096',fontWeight:600}}>Title</th>
                <th style={{padding:'12px 16px',fontSize:12,color:'#718096',fontWeight:600}}>Type</th>
                <th style={{padding:'12px 16px',fontSize:12,color:'#718096',fontWeight:600}}>Order</th>
                <th style={{padding:'12px 16px',fontSize:12,color:'#718096',fontWeight:600}}>Active</th>
                <th style={{padding:'12px 16px',fontSize:12,color:'#718096',fontWeight:600}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const mediaUrl = resolveMediaUrl(item.mediaUrl || '');
                return (
                  <tr key={item.id} style={{borderTop:'1px solid #e2e8f0'}}>
                    <td style={{padding:'12px 16px'}}>
                      {item.mediaType === 'VIDEO' && mediaUrl ? (
                        <video src={mediaUrl} style={{width:120,height:68,borderRadius:8,objectFit:'cover'}} />
                      ) : mediaUrl ? (
                        <img src={mediaUrl} style={{width:120,height:68,borderRadius:8,objectFit:'cover'}} />
                      ) : (
                        <div style={{width:120,height:68,borderRadius:8,background:'#e2e8f0'}} />
                      )}
                    </td>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{fontWeight:600,color:'#2d3748'}}>{item.title || '-'}</div>
                      <div style={{fontSize:12,color:'#718096'}}>{item.subtitle || ''}</div>
                    </td>
                    <td style={{padding:'12px 16px',color:'#4a5568'}}>{item.mediaType}</td>
                    <td style={{padding:'12px 16px',color:'#4a5568'}}>{item.sortOrder ?? 0}</td>
                    <td style={{padding:'12px 16px',color:item.active ? '#38a169' : '#718096'}}>
                      {item.active ? 'Active' : 'Inactive'}
                    </td>
                    <td style={{padding:'12px 16px'}}>
                      <button
                        onClick={() => {
                          setEditing(item);
                          setMediaFile(null);
                        }}
                        style={{padding:'6px 10px',borderRadius:6,border:'1px solid #e2e8f0',background:'white',color:'#4a5568',fontSize:12,cursor:'pointer',marginRight:8}}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{padding:'6px 10px',borderRadius:6,border:'1px solid #e53e3e',background:'white',color:'#e53e3e',fontSize:12,cursor:'pointer'}}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
